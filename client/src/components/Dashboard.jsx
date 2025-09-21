import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/Logo.svg';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        address: user.address || {},
        emergencyContact: user.emergencyContact || {},
        allergies: user.allergies || [],
        medicalHistory: user.medicalHistory || [],
        medications: user.medications || []
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user.gender || '',
      address: user.address || {},
      emergencyContact: user.emergencyContact || {},
      allergies: user.allergies || [],
      medicalHistory: user.medicalHistory || [],
      medications: user.medications || []
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(editData);
    
    if (result.success) {
      setIsEditing(false);
      setMessage(t('profile_updated_successfully'));
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('loading_dashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="Doctorry" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('doctorry')}</h1>
                <p className="text-sm text-gray-600">{t('patient_portal')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{t('book_appointment')}</span>
                </button>
                <button
                  onClick={() => navigate('/appointments')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{t('my_appointments')}</span>
                </button>
              </nav>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{t('welcome')}, {user.firstName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('patient_dashboard')}</h2>
              <p className="text-gray-600 text-lg">{t('manage_health_information')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('book_appointment')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('schedule_appointment_specialists')}</p>
            <button
              onClick={() => navigate('/book-appointment')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <span>{t('book_now')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('my_appointments')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('manage_scheduled_consultations')}</p>
            <button
              onClick={() => navigate('/appointments')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <span>{t('view_all')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Records</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('health_records')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('access_medical_history')}</p>
            <button
              onClick={() => navigate('/health-records')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-purple-700 flex items-center justify-center space-x-2"
            >
              <span>{t('view_records')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('successfully') 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {message.includes('successfully') ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Enhanced Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t('personal_information')}</h3>
                <p className="text-sm text-gray-600">Keep your information up to date</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-700 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{t('edit_profile')}</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 hover:bg-green-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{loading ? t('saving') : t('save_changes')}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{t('cancel')}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('first_name')}</label>
              <input
                type="text"
                name="firstName"
                value={editData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('last_name')}</label>
              <input
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('mobile_number')}</label>
              <input
                type="tel"
                name="mobileNumber"
                value={editData.mobileNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('date_of_birth')}</label>
              <input
                type="date"
                name="dateOfBirth"
                value={editData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={editData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">{t('select_gender')}</option>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-red-50">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{t('emergency_contact')}</h3>
              <p className="text-sm text-gray-600">Important contact information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact_name')}</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={editData.emergencyContact?.name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('relationship')}</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={editData.emergencyContact?.relationship || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone_number')}</label>
              <input
                type="tel"
                name="emergencyContact.phone"
                value={editData.emergencyContact?.phone || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Medical Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Allergies */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-xl bg-red-50">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t('allergies')}</h3>
                <p className="text-sm text-gray-600">Known allergies and reactions</p>
              </div>
            </div>
            {user.allergies && user.allergies.length > 0 ? (
              <div className="space-y-3">
                {user.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{allergy}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-medium">{t('no_allergies_recorded')}</p>
                <p className="text-sm text-gray-400 mt-1">No known allergies on file</p>
              </div>
            )}
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t('current_medications')}</h3>
                <p className="text-sm text-gray-600">Current prescriptions and dosages</p>
              </div>
            </div>
            {user.medications && user.medications.length > 0 ? (
              <div className="space-y-4">
                {user.medications.map((medication, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{medication.name}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Dosage:</span> {medication.dosage}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Frequency:</span> {medication.frequency}
                        </div>
                      </div>
                      <div className="ml-4">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-gray-500 font-medium">{t('no_medications_recorded')}</p>
                <p className="text-sm text-gray-400 mt-1">No current medications on file</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
