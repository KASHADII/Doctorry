import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

const Services = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    {
      id: 1,
      title: 'General Medicine',
      category: 'Primary Care',
      description: 'Comprehensive primary care services including routine checkups, preventive care, and treatment of common illnesses.',
      features: ['Annual Physical Exams', 'Chronic Disease Management', 'Preventive Care', 'Health Screenings'],
      price: 'Starting from $100',
      duration: '30-60 minutes',
      icon: '🏥',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Cardiology',
      category: 'Specialized Care',
      description: 'Expert cardiovascular care including heart disease prevention, diagnosis, and treatment.',
      features: ['Heart Disease Prevention', 'ECG & Stress Tests', 'Cardiac Rehabilitation', 'Hypertension Management'],
      price: 'Starting from $150',
      duration: '45-90 minutes',
      icon: '❤️',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Neurology',
      category: 'Specialized Care',
      description: 'Specialized care for neurological disorders and conditions affecting the brain and nervous system.',
      features: ['Brain Health Assessment', 'Neurological Exams', 'Headache Treatment', 'Memory Care'],
      price: 'Starting from $180',
      duration: '60-90 minutes',
      icon: '🧠',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Pediatrics',
      category: 'Specialized Care',
      description: 'Comprehensive healthcare for children from infancy through adolescence.',
      features: ['Well-child Visits', 'Vaccinations', 'Developmental Screening', 'Acute Illness Care'],
      price: 'Starting from $120',
      duration: '30-45 minutes',
      icon: '👶',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Dermatology',
      category: 'Specialized Care',
      description: 'Expert care for skin conditions, cosmetic procedures, and dermatological health.',
      features: ['Skin Cancer Screening', 'Acne Treatment', 'Cosmetic Procedures', 'Allergy Testing'],
      price: 'Starting from $160',
      duration: '30-60 minutes',
      icon: '✨',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Orthopedics',
      category: 'Specialized Care',
      description: 'Specialized care for musculoskeletal conditions, injuries, and joint problems.',
      features: ['Joint Pain Treatment', 'Sports Injuries', 'Fracture Care', 'Physical Therapy'],
      price: 'Starting from $200',
      duration: '45-75 minutes',
      icon: '🦴',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop'
    },
    {
      id: 7,
      title: 'Mental Health',
      category: 'Wellness',
      description: 'Comprehensive mental health services including therapy, counseling, and psychiatric care.',
      features: ['Individual Therapy', 'Group Counseling', 'Medication Management', 'Crisis Intervention'],
      price: 'Starting from $130',
      duration: '50-60 minutes',
      icon: '🧘',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop'
    },
    {
      id: 8,
      title: 'Telemedicine',
      category: 'Digital Health',
      description: 'Remote healthcare services through secure video consultations and digital health monitoring.',
      features: ['Video Consultations', 'Remote Monitoring', 'Digital Prescriptions', 'Health Tracking'],
      price: 'Starting from $80',
      duration: '20-30 minutes',
      icon: '📱',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=300&fit=crop'
    }
  ];

  const categories = ['all', 'Primary Care', 'Specialized Care', 'Wellness', 'Digital Health'];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Healthcare Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive medical services designed to meet all your healthcare needs with the highest quality of care.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group">
                {/* Service Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold">{service.category}</span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold">{service.duration}</span> consultation
                    </div>
                    <div className="text-lg font-bold text-blue-600">{service.price}</div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300">
                      Book Service
                    </button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition duration-300 shadow-lg">
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide exceptional healthcare services with a focus on patient-centered care and innovative treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Care</h3>
              <p className="text-gray-600">Board-certified physicians and state-of-the-art medical equipment ensure the highest quality of care.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Convenient Access</h3>
              <p className="text-gray-600">Easy appointment scheduling, telemedicine options, and flexible hours to fit your schedule.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovative Technology</h3>
              <p className="text-gray-600">Cutting-edge medical technology and digital health solutions for better patient outcomes.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compassionate Care</h3>
              <p className="text-gray-600">Our team provides empathetic, personalized care that puts your comfort and well-being first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience our comprehensive healthcare services.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Book Appointment Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;
