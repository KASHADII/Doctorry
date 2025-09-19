import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchAppointments();
    
    // Check for success message from navigation state
    const state = navigate.state;
    if (state?.success) {
      setSuccess(state.success);
    }
  }, [isAuthenticated, navigate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('doctorToken');
      const endpoint = user?.role === 'doctor' 
        ? '/api/appointments/doctor-appointments'
        : '/api/appointments/my-appointments';

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAppointments(data.appointments);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = (appointment) => {
    // Check if it's time for the appointment (allow 5 minutes before)
    const appointmentTime = new Date(appointment.appointmentDate);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const fiveMinutes = 5 * 60 * 1000;

    if (timeDiff > fiveMinutes) {
      setError('Appointment is not yet available. Please wait for the scheduled time.');
      return;
    }

    if (timeDiff < -30 * 60 * 1000) { // More than 30 minutes late
      setError('Appointment time has passed. Please contact support.');
      return;
    }

    navigate(`/video-call/${appointment._id}`);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('doctorToken');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Appointment cancelled successfully');
        fetchAppointments();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canJoinCall = (appointment) => {
    const appointmentTime = new Date(appointment.appointmentDate);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const fiveMinutes = 5 * 60 * 1000;
    const thirtyMinutesLate = -30 * 60 * 1000;

    return timeDiff <= fiveMinutes && timeDiff >= thirtyMinutesLate && 
           ['scheduled', 'confirmed'].includes(appointment.status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'doctor' ? 'My Appointments' : 'My Appointments'}
            </h1>
            <p className="mt-2 text-gray-600">
              {user?.role === 'doctor' 
                ? 'Manage your patient consultations' 
                : 'View and manage your medical appointments'
              }
            </p>
          </div>
          {user?.role !== 'doctor' && (
            <button
              onClick={() => navigate('/book-appointment')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Book New Appointment
            </button>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {user?.role === 'doctor' 
                ? 'You don\'t have any scheduled appointments yet.' 
                : 'You haven\'t booked any appointments yet.'
              }
            </p>
            {user?.role !== 'doctor' && (
              <button
                onClick={() => navigate('/book-appointment')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.role === 'doctor' 
                          ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                          : `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                        }
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(appointment.appointmentDate)}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {appointment.appointmentTime}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {appointment.duration} minutes
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {appointment.consultationType}
                      </div>
                      <div>
                        <span className="font-medium">Fee:</span> ₹{appointment.amount}
                      </div>
                      {appointment.symptoms && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                        </div>
                      )}
                    </div>

                    {appointment.prescription && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <span className="font-medium text-blue-900">Prescription:</span>
                        <p className="text-blue-800 mt-1">{appointment.prescription}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {canJoinCall(appointment) && (
                      <button
                        onClick={() => handleJoinCall(appointment)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                      >
                        Join Call
                      </button>
                    )}
                    
                    {['scheduled', 'confirmed'].includes(appointment.status) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    )}

                    {appointment.status === 'completed' && (
                      <button
                        onClick={() => navigate(`/appointment-details/${appointment._id}`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
