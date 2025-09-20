import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MEDICAL_SPECIALIZATIONS } from '../constants/medicalConstants';
import { useTranslation } from 'react-i18next';

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

  // Using shared specializations from constants

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
        // Navigate to appointment confirmation or dashboard
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
    today.setDate(today.getDate() + 1); // Tomorrow
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {t('back_to_dashboard')}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('book_video_consultation')}</h1>
          <p className="mt-2 text-gray-600">{t('schedule_appointment_specialists')}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600">
              {step === 1 && t('select_specialization_date')}
              {step === 2 && t('choose_doctor')}
              {step === 3 && t('select_time_slot')}
              {step === 4 && t('confirm_booking')}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Specialization and Date */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{t('select_specialization_date')}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('medical_specialization')}
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t('select_specialization')}</option>
                  {MEDICAL_SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('preferred_date')}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSpecializationSelect}
                disabled={loading || !specialization || !selectedDate}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('searching') : t('find_available_doctors')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t('available_doctors')}</h2>
              <button
                onClick={() => setStep(1)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← {t('back')}
              </button>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              {t('showing_doctors_for')} {specialization} {t('on')} {formatDate(selectedDate)}
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('no_doctors_available_selected_date')}
              </div>
            ) : (
              <div className="grid gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 cursor-pointer transition-colors"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-gray-600">{doctor.specialization}</p>
                        <p className="text-sm text-gray-500">{doctor.qualification}</p>
                        <p className="text-sm text-gray-500">
                          {doctor.experience} {t('years_experience')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-indigo-600">
                          ₹{doctor.consultationFee}
                        </p>
                        <p className="text-sm text-gray-500">{t('per_consultation')}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {t('available_slots')}: {doctor.availableSlots.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && selectedDoctor && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t('select_time_slot')}</h2>
              <button
                onClick={() => setStep(2)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← {t('back')}
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">
                Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
              </h3>
              <p className="text-gray-600">{formatDate(selectedDate)}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedDoctor.availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 border border-gray-300 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t('confirm_booking')}</h2>
              <button
                onClick={() => setStep(3)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← {t('back')}
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t('appointment_details')}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{t('doctor')}:</span> Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                  <p><span className="font-medium">{t('specialization')}:</span> {selectedDoctor.specialization}</p>
                  <p><span className="font-medium">{t('date')}:</span> {formatDate(selectedDate)}</p>
                  <p><span className="font-medium">{t('time')}:</span> {selectedTime}</p>
                  <p><span className="font-medium">{t('duration')}:</span> 30 {t('minutes')}</p>
                  <p><span className="font-medium">{t('fee')}:</span> ₹{selectedDoctor.consultationFee}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('describe_symptoms_concerns')}
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={t('describe_symptoms_placeholder')}
                />
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={loading || !symptoms.trim()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('booking') : t('confirm_book_appointment')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
