import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

const SingleNews = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  // Sample article data - in a real app, this would come from an API
  const article = {
    id: 1,
    title: 'Revolutionary AI Technology Improves Diagnostic Accuracy',
    excerpt: 'New artificial intelligence system shows 95% accuracy in detecting early-stage diseases, revolutionizing healthcare diagnostics.',
    content: `
      <p>Our latest AI-powered diagnostic system has achieved remarkable results in early disease detection, marking a significant milestone in healthcare technology. The system, developed by our team of medical professionals and AI experts, demonstrates unprecedented accuracy in identifying various medical conditions at their earliest stages.</p>
      
      <p>The technology utilizes advanced machine learning algorithms trained on millions of medical images and patient data points. This comprehensive training approach allows the system to recognize subtle patterns that might be missed by traditional diagnostic methods.</p>
      
      <h3>Key Features of the New System</h3>
      <ul>
        <li>95% accuracy rate in early disease detection</li>
        <li>Reduced diagnosis time from weeks to minutes</li>
        <li>Integration with existing medical records</li>
        <li>Real-time analysis and reporting</li>
      </ul>
      
      <p>The implementation of this technology across our healthcare network has already shown promising results. Patients are experiencing faster diagnosis times, while doctors can focus more on treatment planning rather than lengthy diagnostic processes.</p>
      
      <p>Dr. Sarah Johnson, our Chief Medical Officer, emphasizes the importance of this breakthrough: "This AI system doesn't replace human expertise but enhances it. It allows our medical professionals to make more informed decisions faster, ultimately improving patient outcomes."</p>
      
      <p>Looking ahead, we plan to expand this technology to cover additional medical specialties and integrate it with our telemedicine platform, making advanced diagnostic capabilities accessible to patients regardless of their location.</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
    authorBio: 'Chief Medical Officer with over 15 years of experience in healthcare innovation.',
    date: '2024-01-15',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop',
    readTime: '5 min read',
    tags: ['AI', 'Diagnostics', 'Healthcare Technology', 'Medical Innovation']
  };

  const relatedArticles = [
    {
      id: 2,
      title: 'Telemedicine Services Expand to Rural Areas',
      excerpt: 'Doctorry launches comprehensive telemedicine platform to bring quality healthcare to underserved rural communities.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop',
      date: '2024-01-12',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'New Cardiology Department Opens',
      excerpt: 'State-of-the-art cardiology department opens with advanced equipment and expert medical professionals.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      date: '2024-01-10',
      readTime: '3 min read'
    },
    {
      id: 4,
      title: 'Digital Health Records System Enhanced',
      excerpt: 'New features added to our digital health records system for better patient care and data security.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      date: '2024-01-05',
      readTime: '4 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition duration-200">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/news" className="text-gray-500 hover:text-blue-600 transition duration-200">News</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Article</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
              {article.category}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <img
                  src={article.authorImage}
                  alt={article.author}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readTime}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h4>
                  <div className="flex space-x-4">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-200">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="text-center">
                  <img
                    src={article.authorImage}
                    alt={article.author}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{article.author}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{article.authorBio}</p>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/news/${relatedArticle.id}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition duration-200 line-clamp-2">
                            {relatedArticle.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>{new Date(relatedArticle.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stay Updated with Healthcare News
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss important healthcare updates and medical breakthroughs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/news"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All News
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300">
              Subscribe Newsletter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleNews;
