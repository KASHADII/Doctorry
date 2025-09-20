import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/Logo.svg';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Top Dark Bar */}
      

      {/* Main Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50" style={{backgroundColor: 'var(--color-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div className="flex items-center -ml-32 -mt-4">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src={Logo} 
                  alt="Doctorry Logo" 
                  className="h-50 w-50 contain"
                />
                
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-semibold text-lg transition duration-300 pb-1 ${
                  isActive('/') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
                }`}
                style={{
                  color: isActive('/') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  borderBottomColor: isActive('/') ? 'var(--color-primary)' : 'transparent'
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`font-semibold text-lg transition duration-300 pb-1 ${
                  isActive('/about') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
                }`}
                style={{
                  color: isActive('/about') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  borderBottomColor: isActive('/about') ? 'var(--color-primary)' : 'transparent'
                }}
              >
                About Us
              </Link>
              <Link
                to="/services"
                className={`font-semibold text-lg transition duration-300 pb-1 ${
                  isActive('/services') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
                }`}
                style={{
                  color: isActive('/services') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  borderBottomColor: isActive('/services') ? 'var(--color-primary)' : 'transparent'
                }}
              >
                Services
              </Link>
              <Link
                to="/doctors"
                className={`font-semibold text-lg transition duration-300 pb-1 ${
                  isActive('/doctors') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
                }`}
                style={{
                  color: isActive('/doctors') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  borderBottomColor: isActive('/doctors') ? 'var(--color-primary)' : 'transparent'
                }}
              >
                Doctors
              </Link>
              <Link
                to="/news"
                className={`font-semibold text-lg transition duration-300 pb-1 ${
                  isActive('/news') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
                }`}
                style={{
                  color: isActive('/news') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  borderBottomColor: isActive('/news') ? 'var(--color-primary)' : 'transparent'
                }}
              >
                News
              </Link>
              <Link
                to="/contact"
                className={`font-semibold text-lg transition duration-300 pb-1 ${
                  isActive('/contact') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
                }`}
                style={{
                  color: isActive('/contact') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  borderBottomColor: isActive('/contact') ? 'var(--color-primary)' : 'transparent'
                }}
              >
                Contact
              </Link>
            </div>

            {/* Right Section - Search and Auth Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="text-gray-600 transition duration-200 p-2 rounded-full hover:bg-gray-100" style={{color: 'var(--color-gray-600)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-600)'}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Login Button */}
              <Link
                to="/login"
                className="px-6 py-3 rounded-full font-semibold text-lg transition duration-300"
                style={{
                  border: '2px solid var(--color-primary)',
                  color: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                  e.target.style.color = 'var(--color-white)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--color-primary)';
                }}
              >
                Login
              </Link>
              
              {/* Sign Up Button */}
              <Link
                to="/register"
                className="text-white px-6 py-3 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark))'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, var(--color-primary-dark), var(--color-secondary))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark))';
                }}
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition duration-200"
                style={{color: 'var(--color-gray-600)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-600)'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
              <div className="py-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold transition duration-200 ${
                    isActive('/') 
                      ? 'border-l-4' 
                      : ''
                  }`}
                  style={{
                    color: isActive('/') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    backgroundColor: isActive('/') ? 'var(--color-gray-50)' : 'transparent',
                    borderLeftColor: isActive('/') ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold transition duration-200 ${
                    isActive('/about') 
                      ? 'border-l-4' 
                      : ''
                  }`}
                  style={{
                    color: isActive('/about') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    backgroundColor: isActive('/about') ? 'var(--color-gray-50)' : 'transparent',
                    borderLeftColor: isActive('/about') ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  About Us
                </Link>
                <Link
                  to="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold transition duration-200 ${
                    isActive('/services') 
                      ? 'border-l-4' 
                      : ''
                  }`}
                  style={{
                    color: isActive('/services') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    backgroundColor: isActive('/services') ? 'var(--color-gray-50)' : 'transparent',
                    borderLeftColor: isActive('/services') ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  Services
                </Link>
                <Link
                  to="/doctors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold transition duration-200 ${
                    isActive('/doctors') 
                      ? 'border-l-4' 
                      : ''
                  }`}
                  style={{
                    color: isActive('/doctors') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    backgroundColor: isActive('/doctors') ? 'var(--color-gray-50)' : 'transparent',
                    borderLeftColor: isActive('/doctors') ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  Doctors
                </Link>
                <Link
                  to="/news"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold transition duration-200 ${
                    isActive('/news') 
                      ? 'border-l-4' 
                      : ''
                  }`}
                  style={{
                    color: isActive('/news') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    backgroundColor: isActive('/news') ? 'var(--color-gray-50)' : 'transparent',
                    borderLeftColor: isActive('/news') ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  News
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold transition duration-200 ${
                    isActive('/contact') 
                      ? 'border-l-4' 
                      : ''
                  }`}
                  style={{
                    color: isActive('/contact') ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    backgroundColor: isActive('/contact') ? 'var(--color-gray-50)' : 'transparent',
                    borderLeftColor: isActive('/contact') ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  Contact
                </Link>
                <div className="px-4 py-3 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-6 py-3 rounded-full font-semibold text-lg transition duration-300 text-center"
                    style={{
                      border: '2px solid var(--color-primary)',
                      color: 'var(--color-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-primary)';
                      e.target.style.color = 'var(--color-white)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'var(--color-primary)';
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-white px-6 py-3 rounded-full font-semibold text-lg transition duration-300 text-center shadow-lg"
                    style={{
                      background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark))'
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
