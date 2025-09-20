import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const News = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const newsArticles = [
    {
      id: 1,
      title: 'Revolutionary AI Technology Improves Diagnostic Accuracy',
      excerpt: 'New artificial intelligence system shows 95% accuracy in detecting early-stage diseases, revolutionizing healthcare diagnostics.',
      content: 'Our latest AI-powered diagnostic system has achieved remarkable results in early disease detection...',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop',
      readTime: '5 min read',
      featured: true
    },
    {
      id: 2,
      title: 'Telemedicine Services Expand to Rural Areas',
      excerpt: 'Doctorry launches comprehensive telemedicine platform to bring quality healthcare to underserved rural communities.',
      content: 'We are excited to announce the expansion of our telemedicine services to rural areas...',
      author: 'Dr. Michael Chen',
      date: '2024-01-12',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=300&fit=crop',
      readTime: '4 min read',
      featured: false
    },
    {
      id: 3,
      title: 'New Cardiology Department Opens',
      excerpt: 'State-of-the-art cardiology department opens with advanced equipment and expert medical professionals.',
      content: 'Our new cardiology department features the latest in cardiovascular technology...',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-10',
      category: 'Medical',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
      readTime: '3 min read',
      featured: false
    },
    {
      id: 4,
      title: 'Mental Health Awareness Campaign Launched',
      excerpt: 'Doctorry launches comprehensive mental health awareness campaign to reduce stigma and promote wellness.',
      content: 'Mental health is an integral part of overall wellness, and we are committed to...',
      author: 'Dr. David Thompson',
      date: '2024-01-08',
      category: 'Wellness',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 5,
      title: 'Digital Health Records System Enhanced',
      excerpt: 'New features added to our digital health records system for better patient care and data security.',
      content: 'We have enhanced our digital health records system with new features that...',
      author: 'Dr. Lisa Wang',
      date: '2024-01-05',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop',
      readTime: '4 min read',
      featured: false
    },
    {
      id: 6,
      title: 'Preventive Care Program Success',
      excerpt: 'Our preventive care program shows 40% reduction in chronic disease complications among participants.',
      content: 'The results of our preventive care program have exceeded expectations...',
      author: 'Dr. James Wilson',
      date: '2024-01-03',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
      readTime: '5 min read',
      featured: false
    }
  ];

  const categories = ['all', 'Technology', 'Healthcare', 'Medical', 'Wellness'];

  const filteredArticles = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Healthcare News & Updates</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Stay informed with the latest healthcare news, medical breakthroughs, and updates from Doctorry.
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
                {category === 'all' ? 'All News' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                Featured Article
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center mb-6">
                  <div className="flex items-center text-sm text-gray-500 mr-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {featuredArticle.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mr-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(featuredArticle.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featuredArticle.readTime}
                  </div>
                </div>
                <Link
                  to={`/news/${featuredArticle.id}`}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
                >
                  Read Full Article
                </Link>
              </div>
              
              <div className="relative">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-semibold text-blue-600">{featuredArticle.category}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Latest News</h2>
            <p className="text-xl text-gray-600">Stay updated with the latest healthcare news and developments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group">
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-blue-600">{article.category}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition duration-200">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {article.author}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/news/${article.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition duration-300 shadow-lg">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss important healthcare updates and medical breakthroughs.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition duration-300 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
