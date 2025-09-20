import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MEDICAL_SPECIALIZATIONS } from '../constants/medicalConstants';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    qualification: '',
    experience: '',
    phoneNumber: '',
    consultationFee: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchDoctors();
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors);
      } else {
        setError(t('failed_to_fetch_doctors'));
      }
    } catch (error) {
      setError(t('network_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/doctors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('doctor_created_successfully', { loginId: data.credentials.loginId, password: data.credentials.password }));
        setFormData({
          firstName: '',
          lastName: '',
          specialization: '',
          qualification: '',
          experience: '',
          phoneNumber: '',
          consultationFee: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        });
        setShowAddForm(false);
        fetchDoctors();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(t('network_error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleDoctorStatus = async (doctorId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchDoctors();
      } else {
        setError(t('failed_to_update_doctor_status'));
      }
    } catch (error) {
      setError(t('network_error'));
    }
  };

  const deleteDoctor = async (doctorId) => {
    if (!window.confirm(t('confirm_delete_doctor'))) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchDoctors();
      } else {
        setError(t('failed_to_delete_doctor'));
      }
    } catch (error) {
      setError(t('network_error'));
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">{t('admin_dashboard')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {t('add_doctor')}
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('doctors_management')}</h2>
            
            {doctors.length === 0 ? (
              <p className="text-gray-500">{t('no_doctors_found')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('doctor_id')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('full_name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('specialization')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('experience')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {doctor.doctorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.firstName} {doctor.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.specialization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.experience} {t('years')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            doctor.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {doctor.isActive ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => toggleDoctorStatus(doctor._id, doctor.isActive)}
                            className={`${
                              doctor.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {doctor.isActive ? t('deactivate') : t('activate')}
                          </button>
                          <button
                            onClick={() => deleteDoctor(doctor._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('add_new_doctor')}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder={t('first_name')}
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder={t('last_name')}
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  name="specialization"
                  required
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t('select_specialization')}</option>
                  {MEDICAL_SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="qualification"
                    placeholder={t('qualification')}
                  required
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="experience"
                    placeholder={t('experience_years')}
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    name="consultationFee"
                    placeholder={t('consultation_fee')}
                    required
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                    placeholder={t('phone_number')}
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.city"
                    placeholder={t('city')}
                    value={formData.address.city}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    name="address.state"
                    placeholder={t('state')}
                    value={formData.address.state}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? t('adding') : t('add_doctor')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
