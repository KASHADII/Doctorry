import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo.svg';
import SidebarImage from '../assets/sidebar.png';
import HeartImage from '../assets/heart.png';
import DotsImage from '../assets/dit.svg';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from location state or URL params
    const tokenFromState = location.state?.token;
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    const resetToken = tokenFromState || tokenFromUrl;
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('Invalid or missing reset token');
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await resetPassword(token, formData.newPassword);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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

      {/* Right Section - Reset Password Form */}
      <div className="w-full lg:w-1/2 relative overflow-hidden bg-white">
        {/* Sidebar image background - covers 25% of the area */}
        <div className="absolute top-0 right-0 w-1/4 h-full">
          <img 
            src={SidebarImage} 
            alt="Sidebar background" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Form Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex relative" style={{
              background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, var(--color-primary), var(--color-accent-green)) border-box',
              border: '8px solid transparent'
            }}>
              {/* Left Panel - Reset Password Form */}
              <div className="w-1/2 p-8">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src={Logo} 
                      alt="Doctorry Logo" 
                      className="h-40 w-40 mr-3"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                  <p className="text-gray-600">Enter your new password</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                    <p className="text-sm text-gray-600">Redirecting to login page...</p>
                  </div>
                )}

                {!success && token && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
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
                          placeholder="Confirm new password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      style={{
                        backgroundColor: 'var(--color-primary)'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) e.target.style.backgroundColor = 'var(--color-primary-dark)';
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) e.target.style.backgroundColor = 'var(--color-primary)';
                      }}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    {/* Back to Login */}
                    <Link
                      to="/login"
                      className="w-full block text-center py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 border-2"
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
                      Back to Login
                    </Link>
                  </form>
                )}
              </div>

              {/* Right Panel - Heart Shape with Pills */}
              <div className="w-1/2 flex items-center justify-center" style={{
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

export default ResetPassword;

