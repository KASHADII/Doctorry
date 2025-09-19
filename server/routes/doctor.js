const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Doctor Login
router.post('/login', async (req, res, next) => {
  try {
    const { doctorId, password } = req.body;

    // Find doctor by doctorId
    const doctor = await Doctor.findOne({ doctorId, isActive: true });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid doctor ID or password' });
    }

    // Check password
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid doctor ID or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        doctorId: doctor._id, 
        doctorIdString: doctor.doctorId,
        role: 'doctor'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Doctor login successful',
      token,
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
        availableSlots: doctor.availableSlots,
        isActive: doctor.isActive
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get Doctor Profile
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor privileges required.' });
    }

    const doctor = await Doctor.findById(req.user.doctorId)
      .select('-password')
      .populate('createdBy', 'firstName lastName email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor profile retrieved successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
});

// Update Doctor Profile
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor privileges required.' });
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

    const updateData = {
      firstName,
      lastName,
      specialization,
      qualification,
      experience,
      phoneNumber,
      address,
      consultationFee,
      availableSlots
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const doctor = await Doctor.findByIdAndUpdate(
      req.user.doctorId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor profile updated successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
});

// Change Password
router.put('/change-password', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor privileges required.' });
    }

    const { currentPassword, newPassword } = req.body;

    const doctor = await Doctor.findById(req.user.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await doctor.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    doctor.password = newPassword;
    await doctor.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
