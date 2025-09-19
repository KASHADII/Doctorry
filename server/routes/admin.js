const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create Doctor (Admin only)
router.post('/doctors', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const {
      firstName,
      lastName,
      specialization,
      qualification,
      experience,
      phoneNumber,
      address,
      consultationFee,
      availableSlots
    } = req.body;

    // Generate unique doctor ID and temporary password
    const doctorId = Doctor.generateDoctorId();
    const tempPassword = Math.random().toString(36).slice(-8); // 8 character random password

    // Create new doctor
    const doctor = new Doctor({
      doctorId,
      password: tempPassword,
      firstName,
      lastName,
      specialization,
      qualification,
      experience,
      phoneNumber,
      address,
      consultationFee,
      availableSlots: availableSlots || [],
      createdBy: req.user.adminId
    });

    await doctor.save();

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        phoneNumber: doctor.phoneNumber,
        consultationFee: doctor.consultationFee,
        isActive: doctor.isActive
      },
      credentials: {
        loginId: doctor.doctorId,
        password: tempPassword
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get All Doctors (Admin only)
router.get('/doctors', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const doctors = await Doctor.find({})
      .select('-password')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Doctors retrieved successfully',
      doctors
    });
  } catch (error) {
    next(error);
  }
});

// Get Single Doctor (Admin only)
router.get('/doctors/:id', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const doctor = await Doctor.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'firstName lastName email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor retrieved successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
});

// Update Doctor Status (Admin only)
router.patch('/doctors/:id/status', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { isActive } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: `Doctor ${isActive ? 'activated' : 'deactivated'} successfully`,
      doctor
    });
  } catch (error) {
    next(error);
  }
});

// Delete Doctor (Admin only)
router.delete('/doctors/:id', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
