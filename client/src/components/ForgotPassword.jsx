import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo.svg';
import SidebarImage from '../assets/sidebar.png';
import HeartImage from '../assets/heart.png';
import DotsImage from '../assets/dit.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccess(result.message);
      setResetToken(result.resetToken);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleResetPassword = () => {
    navigate('/reset-password', { state: { token: resetToken } });
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

      {/* Right Section - Forgot Password Form */}
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
              {/* Left Panel - Forgot Password Form */}
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                  <p className="text-gray-600">Enter your email to reset your password</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                    {resetToken && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Reset Token (for testing):</p>
                        <p className="text-xs bg-gray-100 p-2 rounded font-mono break-all">{resetToken}</p>
                        <button
                          onClick={handleResetPassword}
                          className="mt-3 w-full text-white py-3 px-4 rounded-lg font-semibold transition duration-200"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          Reset Password
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!success && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
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
                      {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;

