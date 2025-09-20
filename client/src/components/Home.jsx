import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">{t('doctorry')}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    {t('dashboard')}
                  </Link>
                  <Link
                    to="/book-appointment"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition duration-200"
                  >
                    {t('book_appointment')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
              <div className="border-l border-gray-300 h-6"></div>
              <div className="flex space-x-2">
                <Link
                  to="/admin/login"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition duration-200"
                >
                  {t('admin')}
                </Link>
                <Link
                  to="/doctor/login"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition duration-200"
                >
                  {t('doctor')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero_title')}
              <span className="text-blue-600 block">{t('hero_subtitle')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {t('start_journey')}
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition duration-200"
                  >
                    {t('sign_in')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-indigo-300 rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('why_choose_doctorry')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('why_choose_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('secure_records')}</h3>
              <p className="text-gray-600">
                {t('secure_records_description')}
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition duration-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('access_24_7')}</h3>
              <p className="text-gray-600">
                {t('access_24_7_description')}
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('quick_easy')}</h3>
              <p className="text-gray-600">
                {t('quick_easy_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('ready_take_control')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('join_thousands')}
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
            >
              {t('get_started_today')}
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Doctorry</h3>
            <p className="text-gray-400 mb-4">
              {t('empowering_patients')}
            </p>
            <p className="text-gray-500 text-sm">
              {t('all_rights_reserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
