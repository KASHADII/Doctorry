import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MEDICAL_SPECIALIZATIONS } from '../constants/medicalConstants';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [specialization, setSpecialization] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleSpecializationSelect = async () => {
    if (!specialization || !selectedDate) {
      setError(t('please_select_specialization_date'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/doctors/${specialization}?date=${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDoctors(data.doctors);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(t('network_error_try_again'));
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedTime || !symptoms.trim()) {
      setError(t('please_fill_all_required_fields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          symptoms: symptoms.trim(),
          consultationType: 'video'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/appointments', { state: { success: t('appointment_booked_successfully') } });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(t('network_error_try_again'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Schedule a consultation with our expert doctors and get the care you need.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-20 h-2 mx-4 rounded-full ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-lg font-semibold text-gray-700">
              {step === 1 && 'Select Specialization & Date'}
              {step === 2 && 'Choose Your Doctor'}
              {step === 3 && 'Select Time Slot'}
              {step === 4 && 'Confirm Booking'}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Step 1: Specialization and Date */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Select Your Needs</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Medical Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Choose a specialization</option>
                  {MEDICAL_SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <button
                onClick={handleSpecializationSelect}
                disabled={loading || !specialization || !selectedDate}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-xl font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Searching...' : 'Find Available Doctors'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Available Doctors</h2>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                ← Back
              </button>
            </div>

            <div className="mb-6 text-lg text-gray-600">
              Showing doctors for <span className="font-semibold">{specialization}</span> on <span className="font-semibold">{formatDate(selectedDate)}</span>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.576" />
                </svg>
                <p className="text-xl">No doctors available for the selected date</p>
                <p className="text-sm mt-2">Please try selecting a different date</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 cursor-pointer transition duration-300 hover:shadow-lg"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-lg text-blue-600 font-semibold mb-2">{doctor.specialization}</p>
                        <p className="text-gray-600 mb-1">{doctor.qualification}</p>
                        <p className="text-gray-500">
                          {doctor.experience} years of experience
                        </p>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            Available slots: <span className="font-semibold text-blue-600">{doctor.availableSlots.length}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{doctor.consultationFee}
                        </p>
                        <p className="text-sm text-gray-500">per consultation</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && selectedDoctor && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Select Time Slot</h2>
              <button
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                ← Back
              </button>
            </div>

            <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
              </h3>
              <p className="text-lg text-gray-600">{formatDate(selectedDate)}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedDoctor.availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition duration-300 font-semibold text-lg"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Confirm Your Booking</h2>
              <button
                onClick={() => setStep(3)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-8">
              <div className="border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  <div>
                    <p className="font-semibold text-gray-700">Doctor:</p>
                    <p className="text-gray-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Specialization:</p>
                    <p className="text-gray-900">{selectedDoctor.specialization}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Date:</p>
                    <p className="text-gray-900">{formatDate(selectedDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Time:</p>
                    <p className="text-gray-900">{selectedTime}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Duration:</p>
                    <p className="text-gray-900">30 minutes</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Consultation Fee:</p>
                    <p className="text-blue-600 font-bold text-xl">₹{selectedDoctor.consultationFee}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Describe your symptoms or concerns
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={6}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Please describe your symptoms, concerns, or reason for the appointment..."
                />
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={loading || !symptoms.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-8 rounded-xl font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Booking Appointment...' : 'Confirm & Book Appointment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
