import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import CardCarousel from './CardCarousel';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{
        backgroundImage: 'linear-gradient(rgba(39, 97, 126, 0.7), rgba(0, 38, 60, 0.8)), url(/src/assets/Doctor.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full" style={{backgroundColor: 'var(--color-primary)'}}></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full" style={{backgroundColor: 'var(--color-accent-teal)'}}></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full" style={{backgroundColor: 'var(--color-accent-green)'}}></div>
          <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full" style={{backgroundColor: 'var(--color-accent-lime)'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left -ml-170">
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                {t('hero_title')}
                <span className="block" style={{color: 'var(--color-accent-lime)'}}>{t('hero_subtitle')}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                {t('hero_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/register"
                      className="text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                      {t('get_started_today')}
                    </Link>
                    <Link
                      to="/book-appointment"
                      className="px-8 py-4 rounded-full font-semibold text-lg transition duration-300"
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
                      {t('book_an_appointment')}
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <Link
                    to="/ai-seva"
                    className="text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                    style={{
                      background: 'linear-gradient(to right, var(--color-accent-green), var(--color-accent-teal))'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(to right, var(--color-accent-teal), var(--color-accent-green))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(to right, var(--color-accent-green), var(--color-accent-teal))';
                    }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{t('ai_seva')}</span>
                  </Link>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80">Expert Doctors</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-white/80">Happy Patients</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-white/80">Support</div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{color: 'var(--color-gray-900)'}}>
              
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{color: 'var(--color-gray-600)'}}>
             
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Book Appointment Button */}
            <Link
              to="/book-appointment"
              className="group flex items-center justify-between px-8 py-6 rounded-xl text-white font-semibold text-xl transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[350px]"
              style={{
                background: 'linear-gradient(to right, #0d7377, #14a085)'
              }}
            >
              <span>{t('book_an_appointment')}</span>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>

            {/* Pharmacy Locator Button */}
            <Link
              to="/pharmacy"
              className="group flex items-center justify-between px-8 py-6 rounded-xl text-white font-semibold text-xl transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[350px]"
              style={{
                background: 'linear-gradient(to right, #32d74b, #30d158)'
              }}
            >
              <span>{t('pharmacy_locator')}</span>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* AI Seva Button */}
            {isAuthenticated && (
              <Link
                to="/ai-seva"
                className="group flex items-center justify-between px-8 py-6 rounded-xl text-white font-semibold text-xl transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[350px]"
                style={{
                  background: 'linear-gradient(to right, #1e3a8a, #1e40af)'
                }}
              >
                <span>{t('ai_seva')}</span>
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      

      {/* Doctorry Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Welcome Text */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg uppercase tracking-wider font-bold text-gray-600">
                Welcome to
              </p>
              <h2 className="text-3xl font-bold text-gray-800">
                डॉक्टर
              </h2>
            </div>
          </div>

          {/* Main Tagline */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{
              fontFamily: 'serif',
              color: '#0d7377'
            }}>
              {t('quality_care_anytime_anywhere')}
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
            At <span className="font-semibold text-gray-800">डॉक्टर</span>, we provide compassionate telemedicine services, making quality healthcare accessible to 173 villages. Reduce travel, connect with specialists, and receive timely care that puts rural well-being first.
          </p>

          {/* Learn More Button */}
          <div className="flex justify-center">
            <Link
              to="/about"
              className="inline-flex items-center text-lg font-medium transition duration-300 hover:scale-105"
              style={{color: '#0d7377'}}
            >
              {t('learn_more')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Card Carousel Section */}
      <section className="py-20" style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)'
      }}>
        <CardCarousel />
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center" style={{
        background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark), var(--color-secondary))'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: 'var(--color-gray-100)'}}>
            Join thousands of patients who trust Doctorry for their healthcare needs. Start your journey to better health today.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{color: 'var(--color-primary)'}}
              >
                Get Started Today
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition duration-300"
                style={{color: 'var(--color-white)'}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-white)';
                  e.target.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--color-white)';
                }}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16" style={{backgroundColor: 'var(--color-secondary)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/src/assets/Logo.svg" 
                  alt="Doctorry Logo" 
                  className="h-10 w-auto"
                />
                <h3 className="text-2xl font-bold">Doctorry</h3>
              </div>
              <p className="mb-6 max-w-md" style={{color: 'var(--color-gray-400)'}}>
                Empowering patients with accessible, quality healthcare solutions through innovative technology and compassionate care.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>About Us</Link></li>
                <li><Link to="/news" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>News</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>Contact Us</Link></li>
                <li><a href="#" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>Help Center</a></li>
                <li><a href="#" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>Privacy Policy</a></li>
                <li><a href="#" className="transition duration-200" style={{color: 'var(--color-gray-400)'}} onMouseEnter={(e) => e.target.style.color = 'var(--color-white)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-400)'}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 text-center" style={{borderTop: '1px solid var(--color-gray-800)'}}>
            <p style={{color: 'var(--color-gray-400)'}}>
              © 2024 Doctorry. All rights reserved. | Empowering healthcare through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
