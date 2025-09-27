const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { mobileNumber, email, password, firstName, lastName, dateOfBirth, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already registered' : 'Mobile number already registered'
      });
    }

    // Create new user
    const user = new User({
      mobileNumber,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real application, you would send this token via email
    // For now, we'll return it in the response for testing
    res.json({
      message: 'Password reset token generated successfully',
      resetToken: resetToken, // Remove this in production
      instructions: 'Use this token to reset your password. Token expires in 10 minutes.'
    });
  } catch (error) {
    next(error);
  }
});

// Mock Upload Document (for testing without Cloudinary)
router.post('/upload-document-mock', authenticateToken, async (req, res, next) => {
  try {
    console.log('Mock upload request received:', {
      documentType: req.body.documentType,
      userId: req.user.userId
    });

    const { documentType } = req.body;
    const userId = req.user.userId;

    if (!documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    const allowedTypes = ['aadhar', 'pan', 'ayushman', 'other'];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    // Find user and add mock document
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const documentData = {
      type: documentType,
      url: `https://via.placeholder.com/300x200?text=${documentType.toUpperCase()}`,
      fileName: `${documentType}-document.pdf`,
      uploadedAt: new Date()
    };

    user.documents.push(documentData);
    await user.save();

    res.json({
      message: 'Document uploaded successfully (mock)',
      document: documentData
    });
  } catch (error) {
    console.error('Mock upload error:', error);
    next(error);
  }
});

// Upload Document
router.post('/upload-document', authenticateToken, upload.single('document'), async (req, res, next) => {
  try {
    console.log('Upload request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null,
      documentType: req.body.documentType,
      userId: req.user.userId
    });

    const { documentType } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!documentType) {
      console.log('No document type provided');
      return res.status(400).json({ message: 'Document type is required' });
    }

    const allowedTypes = ['aadhar', 'pan', 'ayushman', 'other'];
    if (!allowedTypes.includes(documentType)) {
      console.log('Invalid document type:', documentType);
      return res.status(400).json({ message: 'Invalid document type' });
    }

    // Find user and add document
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const documentData = {
      type: documentType,
      url: req.file.path,
      fileName: req.file.originalname,
      uploadedAt: new Date()
    };

    console.log('Document data to save:', documentData);

    user.documents.push(documentData);
    await user.save();

    console.log('Document saved successfully');

    res.json({
      message: 'Document uploaded successfully',
      document: documentData
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
});

// Get User Documents
router.get('/documents', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('documents');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ documents: user.documents });
  } catch (error) {
    next(error);
  }
});

// Delete Document
router.delete('/documents/:documentId', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { documentId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const documentIndex = user.documents.findIndex(doc => doc._id.toString() === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    user.documents.splice(documentIndex, 1);
    await user.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Reset Password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
