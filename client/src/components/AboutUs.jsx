import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

const AboutUs = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      position: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
      bio: 'Leading our medical team with over 15 years of experience in rural healthcare innovation.'
    },
    {
      name: 'Dr. Priya Sharma',
      position: 'Head of Technology',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
      bio: 'Pioneering telemedicine solutions to improve healthcare accessibility in rural areas.'
    },
    {
      name: 'Dr. Amit Singh',
      position: 'Patient Care Director',
      image: 'https://images.unsplash.com/photo-1594824388852-9a0a5b0b0b0b?w=300&h=300&fit=crop&crop=face',
      bio: 'Ensuring exceptional patient experiences through compassionate care and support.'
    },
    {
      name: 'Dr. Sunita Patel',
      position: 'Clinical Operations Lead',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
      bio: 'Optimizing clinical workflows and maintaining the highest standards of medical practice.'
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(/src/assets/abt.png)'
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Welcome Text */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg uppercase tracking-wider font-bold text-gray-600">
                About
              </p>
              <h2 className="text-3xl font-bold text-gray-800">
                डॉक्टर
              </h2>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{
              fontFamily: 'serif',
              color: '#0d7377'
            }}>
              Transforming Rural Healthcare
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We are committed to making quality healthcare accessible to <span className="font-semibold text-gray-800">173 villages</span> through innovative telemedicine technology, compassionate care, and patient-centered solutions.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                To make quality healthcare accessible, affordable, and convenient for <span className="font-semibold text-gray-800">173 villages</span>. We believe that 
                everyone deserves access to the best medical care, regardless of their location or circumstances.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our innovative telemedicine platform, we connect rural patients with top-rated doctors, streamline 
                healthcare processes, and provide comprehensive medical services that put patients first.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-100 to-green-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#0d7377'}}>
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Rural-First Approach</h3>
                    <p className="text-gray-600">Every feature we build is designed with rural patients' needs and accessibility in mind.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of healthcare professionals and technology experts work together to deliver exceptional rural care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full" style={{background: 'linear-gradient(to-t, rgba(13, 115, 119, 0.2), transparent)'}}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="font-semibold mb-3" style={{color: '#0d7377'}}>{member.position}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that reflect our commitment to improving rural healthcare accessibility and quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl">
              <div className="text-4xl font-bold mb-2" style={{color: '#0d7377'}}>25K+</div>
              <div className="text-gray-700 font-semibold">Rural Patients Served</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
              <div className="text-4xl font-bold mb-2" style={{color: '#0d7377'}}>200+</div>
              <div className="text-gray-700 font-semibold">Expert Doctors</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl">
              <div className="text-4xl font-bold mb-2" style={{color: '#0d7377'}}>173</div>
              <div className="text-gray-700 font-semibold">Villages Covered</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
              <div className="text-4xl font-bold mb-2" style={{color: '#0d7377'}}>95%</div>
              <div className="text-gray-700 font-semibold">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center" style={{
        background: 'linear-gradient(to right, #0d7377, #14a085)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Our Rural Healthcare Revolution
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the future of rural healthcare with डॉक्टर. Book your appointment today and be part of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-appointment"
              className="bg-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{color: '#0d7377'}}
            >
              Book Appointment
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition duration-300"
              style={{color: 'white'}}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#0d7377';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
