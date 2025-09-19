import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  // Agora configuration
  const APP_ID = process.env.REACT_APP_AGORA_APP_ID || 'your-agora-app-id';
  const TOKEN = process.env.REACT_APP_AGORA_TOKEN || null; // You'll need to generate this
  
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
        // Check if it's time for the appointment
        const appointmentTime = new Date(data.appointment.appointmentDate);
        const now = new Date();
        const timeDiff = appointmentTime.getTime() - now.getTime();
        
        if (timeDiff > 0 && timeDiff > 15 * 60 * 1000) { // More than 15 minutes early
          setError('Appointment is not yet available. Please wait for the scheduled time.');
        }
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
      setError('Failed to join the call. Please check your internet connection.');
    }
  };

  const createAndPublishTracks = async () => {
    try {
      // Create audio track
      localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      
      // Create video track
      localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
      
      // Play local video
      localVideoTrackRef.current.play(localVideoRef.current);
      
      // Publish tracks
      await clientRef.current.publish([
        localAudioTrackRef.current,
        localVideoTrackRef.current
      ]);

      console.log('Local tracks published successfully');
    } catch (error) {
      console.error('Failed to create or publish tracks:', error);
      setError('Failed to initialize camera and microphone. Please check permissions.');
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    try {
      await clientRef.current.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play(remoteVideoRef.current);
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
      setError('Failed to start screen sharing. Please try again.');
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      // Initialize Agora
      await initializeAgora();
    } catch (error) {
      console.error('Permission denied or device error:', error);
      setError('Camera and microphone access is required for video calls. Please allow permissions and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading appointment details...</p>
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
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <h1 className="text-2xl font-bold mb-4">Video Consultation</h1>
          {appointment && (
            <div className="bg-gray-800 p-4 rounded mb-6">
              <p><strong>Doctor:</strong> Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
              <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            </div>
          )}
          <button
            onClick={joinCall}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Call'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Call Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            Dr. {appointment?.doctor.firstName} {appointment?.doctor.lastName}
          </h1>
          <p className="text-sm text-gray-300">
            {appointment?.specialization} • {formatDuration(callDuration)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Call in progress</span>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
          {/* Remote Video */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div 
              ref={remoteVideoRef}
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              Doctor
            </div>
          </div>

          {/* Local Video */}
          <div className="bg-gray-800 rounded-lg overflow-hidden relative">
            <div 
              ref={localVideoRef}
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              You
            </div>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-gray-800 p-6">
        <div className="flex justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-600' : 'bg-gray-600'
            } hover:bg-opacity-80`}
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
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isVideoEnabled ? 'bg-gray-600' : 'bg-red-600'
            } hover:bg-opacity-80`}
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
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isScreenSharing ? 'bg-blue-600' : 'bg-gray-600'
            } hover:bg-opacity-80`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-2 0V5H5v10h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm10 4a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1V8zm2 1v4h1V9h-1z" clipRule="evenodd" />
            </svg>
          </button>

          {/* End Call Button */}
          <button
            onClick={leaveCall}
            className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700"
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
