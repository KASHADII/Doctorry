// Load environment variables if dotenv is available
try {
  require('dotenv').config();
} catch (error) {
  console.log('ℹ️  dotenv not found, using system environment variables');
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const notificationRoutes = require('./routes/notifications');
const { errorHandler } = require('./middleware/errorHandler');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and create default admin
const initializeServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create default admin if it doesn't exist
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ Server initialization error:', error);
    process.exit(1);
  }
};

// Function to create default admin
const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@doctorry.com' });
    
    if (existingAdmin) {
      console.log('✅ Default admin already exists');
      return;
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@doctorry.com',
      password: 'admin123', // This will be hashed automatically
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Default admin created successfully');
    console.log('📧 Email: admin@doctorry.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb_uri: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('📡 MongoDB connection closed');
  process.exit(0);
});

// Start the server
const startServer = async () => {
  await initializeServer();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  });
};

// Start the server
startServer();