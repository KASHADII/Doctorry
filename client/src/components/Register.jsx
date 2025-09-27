import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import DocumentUpload from './DocumentUpload';
import Logo from '../assets/Logo.svg';
import SidebarImage from '../assets/sidebar.png';
import HeartImage from '../assets/heart.png';
import DotsImage from '../assets/dit.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleDocumentsChange = (newDocuments) => {
    setDocuments(newDocuments);
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwords_dont_match'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t('password_min_length'));
      setLoading(false);
      return;
    }

    // Check document requirements
    if (documents.length < 2) {
      setError('Please select at least 2 documents to complete registration');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      // Store documents temporarily for post-registration upload
      if (documents.length > 0) {
        localStorage.setItem('pendingDocuments', JSON.stringify(documents));
        navigate('/upload-documents');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white flex-col items-center justify-center relative">
        {/* Logo */}
        <div className="mb-4">
          <img 
            src={Logo} 
            alt="Doctorry Logo" 
            className="h-60 w-60"
          />
        </div>
        
        {/* Tagline */}
        <h1 className="text-3xl font-bold text-center mb-4" style={{color: 'var(--color-primary)'}}>
          Apki Sehat Humari Zimmendari
        </h1>
        
        {/* Decorative dots pattern */}
        <div className="absolute bottom-10 left-10 opacity-30">
          <img 
            src={DotsImage} 
            alt="Decorative dots" 
            className="w-16 h-16"
          />
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="w-full lg:w-1/2 relative overflow-hidden bg-white">
        {/* Sidebar image background - covers 25% of the area */}
        <div className="absolute top-0 right-0 w-1/4 h-full">
          <img 
            src={SidebarImage} 
            alt="Sidebar background" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Register Form Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex relative" style={{
              background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, var(--color-primary), var(--color-accent-green)) border-box',
              border: '8px solid transparent'
            }}>
              {/* Left Panel - Register Form */}
              <div className="w-2/3 p-8">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src={Logo} 
                      alt="Doctorry Logo" 
                      className="h-40 w-40 mr-3"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                  <p className="text-gray-600">Join डॉक्टर and get started with quality healthcare</p>
                  
                  {/* Step Indicator */}
                  <div className="flex items-center justify-center mt-4 space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      1
                    </div>
                    <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      2
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {currentStep === 1 ? 'Personal Information' : 'Document Upload'}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {currentStep === 1 ? (
                  <form onSubmit={handleNextStep} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="First Name"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Last Name"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email and Mobile */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Email Address"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Mobile Number"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date of Birth and Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <select
                          id="gender"
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Create Password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm Password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    type="submit"
                    className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: 'var(--color-primary)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-dark)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
                  >
                    Next: Upload Documents
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="font-medium transition duration-200"
                        style={{color: 'var(--color-primary)'}}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
                ) : (
                  <div className="space-y-6">
                    {/* Document Upload Component */}
                    <DocumentUpload 
                      onDocumentsChange={handleDocumentsChange}
                      requiredDocuments={2}
                    />
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={handlePrevStep}
                        className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 border-2"
                        style={{
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--color-primary)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'var(--color-primary)';
                        }}
                      >
                        Back
                      </button>
                      
                      <button
                        onClick={handleSubmit}
                        disabled={loading || documents.length < 2}
                        className="flex-1 text-white py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        style={{
                          backgroundColor: 'var(--color-primary)'
                        }}
                        onMouseEnter={(e) => {
                          if (!loading && documents.length >= 2) e.target.style.backgroundColor = 'var(--color-primary-dark)';
                        }}
                        onMouseLeave={(e) => {
                          if (!loading && documents.length >= 2) e.target.style.backgroundColor = 'var(--color-primary)';
                        }}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </div>
                    
                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link
                          to="/login"
                          className="font-medium transition duration-200"
                          style={{color: 'var(--color-primary)'}}
                          onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
                        >
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Heart Shape with Pills */}
              <div className="w-1/3 flex items-center justify-center" style={{
                background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c8)'
              }}>
                <img 
                  src={HeartImage} 
                  alt="Heart made of pills" 
                  className="w-60 h-60 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
