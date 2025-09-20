import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useTranslation } from 'react-i18next';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Agora configuration - using environment variable
  const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'ec41c49da5c0442b892490a9bbd037d5';
  const TOKEN = import.meta.env.VITE_AGORA_TOKEN || null;
  
  // State management
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Refs for Agora
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const screenTrackRef = useRef(null);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    fetchAppointmentDetails();
    return () => {
      // Cleanup
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      leaveCall();
    };
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('doctorToken');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAppointment(data.appointment);
        // Allow immediate call joining for testing - no timing restrictions
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const initializeAgora = async () => {
    try {
      // Create Agora client
      clientRef.current = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8' 
      });

      // Set up event listeners
      clientRef.current.on('user-published', handleUserPublished);
      clientRef.current.on('user-unpublished', handleUserUnpublished);
      clientRef.current.on('user-left', handleUserLeft);

      // Join the channel
      const uid = await clientRef.current.join(
        APP_ID,
        appointment.callRoomId,
        TOKEN,
        null
      );

      console.log('Joined channel successfully with UID:', uid);

      // Create and publish local tracks
      await createAndPublishTracks();

      setIsJoined(true);
      startCallTimer();
      
      // Update appointment status to in-progress
      await updateAppointmentStatus('in-progress');

    } catch (error) {
      console.error('Failed to join channel:', error);
      setError(t('failed_to_join_call'));
    }
  };

  const createAndPublishTracks = async () => {
    try {
      // Create audio track
      localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      
      // Create video track with better configuration
      localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          width: 640,
          height: 480,
          frameRate: 15,
          bitrateMin: 200,
          bitrateMax: 400
        }
      });
      
      // Play local video with better styling
      if (localVideoRef.current) {
        localVideoTrackRef.current.play(localVideoRef.current, {
          mirror: true, // Mirror the local video
          fit: 'cover' // Cover the container
        });
      }
      
      // Publish tracks
      await clientRef.current.publish([
        localAudioTrackRef.current,
        localVideoTrackRef.current
      ]);

      console.log('Local tracks published successfully');
    } catch (error) {
      console.error('Failed to create or publish tracks:', error);
      setError(t('failed_to_initialize_camera_microphone'));
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    try {
      await clientRef.current.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        if (remoteVideoRef.current) {
          remoteVideoTrack.play(remoteVideoRef.current, {
            fit: 'cover' // Cover the container
          });
        }
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    } catch (error) {
      console.error('Failed to subscribe to user:', error);
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      const remoteVideoTrack = user.videoTrack;
      remoteVideoTrack.stop();
    }
  };

  const handleUserLeft = (user) => {
    console.log('User left:', user.uid);
  };

  const toggleMute = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        screenTrackRef.current = await AgoraRTC.createScreenVideoTrack();
        await clientRef.current.unpublish([localVideoTrackRef.current]);
        await clientRef.current.publish([screenTrackRef.current]);
        screenTrackRef.current.play(localVideoRef.current);
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        await clientRef.current.unpublish([screenTrackRef.current]);
        await clientRef.current.publish([localVideoTrackRef.current]);
        localVideoTrackRef.current.play(localVideoRef.current);
        screenTrackRef.current.close();
        screenTrackRef.current = null;
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
      setError(t('screen_share_failed'));
    }
  };

  const leaveCall = async () => {
    try {
      // Stop all tracks
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.close();
      }

      // Leave the channel
      if (clientRef.current) {
        await clientRef.current.leave();
      }

      // Update appointment status
      await updateAppointmentStatus('completed');

      // Navigate back
      navigate('/appointments');
    } catch (error) {
      console.error('Failed to leave call:', error);
    }
  };

  const updateAppointmentStatus = async (status) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('doctorToken');
      await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const startCallTimer = () => {
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const joinCall = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check for camera and microphone permissions
      console.log('Requesting camera and microphone permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15 }
        }, 
        audio: true 
      });
      
      console.log('Permissions granted, stream created:', stream);
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      // Initialize Agora
      await initializeAgora();
    } catch (error) {
      console.error('Permission denied or device error:', error);
      if (error.name === 'NotAllowedError') {
        setError(t('camera_microphone_permission_required'));
      } else if (error.name === 'NotFoundError') {
        setError(t('no_camera_microphone_found'));
      } else {
        setError(t('failed_to_access_camera_microphone'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t('loading_appointment_details')}</p>
        </div>
      </div>
    );
  }

  if (error && !isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="bg-red-600 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to {t('my_appointments')}
          </button>
        </div>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <h1 className="text-2xl font-bold mb-4">{t('video_call_title')}</h1>
          {appointment && (
            <div className="bg-gray-800 p-4 rounded mb-6">
              <p><strong>{t('doctor')}:</strong> Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
              <p><strong>{t('appointment_date')}:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>{t('appointment_time')}:</strong> {appointment.appointmentTime}</p>
            </div>
          )}
          <button
            onClick={joinCall}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? t('joining_call') : t('join_call_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Mobile-First Header */}
      <div className="bg-gray-900 p-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/appointments')}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-semibold">
              Dr. {appointment?.doctor.firstName} {appointment?.doctor.lastName}
            </h1>
            <p className="text-xs text-gray-400">
              {appointment?.specialization} • {formatDuration(callDuration)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">{t('live')}</span>
        </div>
      </div>

      {/* Mobile-First Video Container */}
      <div className="flex-1 relative">
        {/* Main Video (Remote) - Full Screen on Mobile */}
        <div className="absolute inset-0 bg-gray-800">
          <div 
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            style={{ minHeight: '100%' }}
          />
          {/* No video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">{t('waiting_for_doctor')}</p>
            </div>
          </div>
        </div>

        {/* Local Video - Picture-in-Picture */}
        <div className="absolute top-4 right-4 w-24 h-32 bg-gray-700 rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
          <div 
            ref={localVideoRef}
            className="w-full h-full object-cover"
          />
          {/* Local video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-400 text-xs">{t('you')}</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
          <span className="text-xs text-white">{t('connected')}</span>
        </div>
      </div>

      {/* Mobile-First Call Controls */}
      <div className="bg-gray-900 p-4 pb-6">
        <div className="flex justify-center items-center space-x-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.794a1 1 0 011.617.794zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.794a1 1 0 011.617.794zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-2 0V5H5v10h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm10 4a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1V8zm2 1v4h1V9h-1z" clipRule="evenodd" />
            </svg>
          </button>

          {/* End Call Button */}
          <button
            onClick={leaveCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
