const express = require('express');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get available doctors by specialization
router.get('/doctors/:specialization', async (req, res, next) => {
  try {
    const { specialization } = req.params;
    const { date } = req.query;

    const doctors = await Doctor.find({ 
      specialization: new RegExp(specialization, 'i'),
      isActive: true 
    }).select('-password');

    // Get available time slots for each doctor
    const doctorsWithSlots = await Promise.all(
      doctors.map(async (doctor) => {
        const appointments = await Appointment.find({
          doctor: doctor._id,
          appointmentDate: new Date(date),
          status: { $in: ['scheduled', 'confirmed'] }
        });

        // Generate available time slots (9 AM to 6 PM, 30-minute slots)
        const availableSlots = [];
        const startHour = 9;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const slotDateTime = new Date(date);
            slotDateTime.setHours(hour, minute, 0, 0);
            
            // Check if slot is available
            const isBooked = appointments.some(apt => {
              const aptTime = apt.appointmentTime;
              return aptTime === timeString;
            });

            if (!isBooked && slotDateTime > new Date()) {
              availableSlots.push(timeString);
            }
          }
        }

        return {
          ...doctor.toObject(),
          availableSlots: availableSlots.slice(0, 10) // Limit to 10 slots
        };
      })
    );

    res.json({
      message: 'Available doctors retrieved successfully',
      doctors: doctorsWithSlots
    });
  } catch (error) {
    next(error);
  }
});

// Book appointment
router.post('/book', authenticateToken, async (req, res, next) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      symptoms,
      consultationType = 'video'
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Doctor ID, date, and time are required' });
    }

    // Check if doctor exists and is active
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ message: 'Doctor not found or inactive' });
    }

    // Check if slot is still available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Time slot is no longer available' });
    }

    // Generate unique IDs
    const appointmentId = Appointment.generateAppointmentId();
    const callRoomId = Appointment.generateCallRoomId();

    // Create appointment (auto-confirmed for testing)
    const appointment = new Appointment({
      appointmentId,
      patient: req.user.userId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      symptoms,
      consultationType,
      callRoomId,
      amount: doctor.consultationFee,
      status: 'confirmed' // Auto-confirm for testing
    });

    await appointment.save();

    // Populate the appointment with patient and doctor details
    await appointment.populate('patient', 'firstName lastName email mobileNumber');
    await appointment.populate('doctor', 'firstName lastName specialization qualification consultationFee');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment._id,
        appointmentId: appointment.appointmentId,
        patient: appointment.patient,
        doctor: appointment.doctor,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        callRoomId: appointment.callRoomId,
        amount: appointment.amount
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's appointments
router.get('/my-appointments', authenticateToken, async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.userId })
      .populate('doctor', 'firstName lastName specialization qualification')
      .sort({ appointmentDate: -1 });

    res.json({
      message: 'Appointments retrieved successfully',
      appointments
    });
  } catch (error) {
    next(error);
  }
});

// Get doctor's appointments
router.get('/doctor-appointments', authenticateToken, async (req, res, next) => {
  try {
    // Check if user is doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor privileges required' });
    }

    const appointments = await Appointment.find({ doctor: req.user.doctorId })
      .populate('patient', 'firstName lastName email mobileNumber')
      .sort({ appointmentDate: -1 });

    res.json({
      message: 'Doctor appointments retrieved successfully',
      appointments
    });
  } catch (error) {
    next(error);
  }
});

// Update appointment status
router.patch('/:id/status', authenticateToken, async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    const isPatient = appointment.patient.toString() === req.user.userId;
    const isDoctor = req.user.role === 'doctor' && appointment.doctor.toString() === req.user.doctorId;
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    
    // Set call start/end times
    if (status === 'in-progress') {
      appointment.callStartedAt = new Date();
    } else if (status === 'completed' && appointment.callStartedAt) {
      appointment.callEndedAt = new Date();
      appointment.callDuration = Math.round((appointment.callEndedAt - appointment.callStartedAt) / (1000 * 60));
    }

    await appointment.save();

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
});

// Get appointment details
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email mobileNumber')
      .populate('doctor', 'firstName lastName specialization qualification');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    const isPatient = appointment.patient._id.toString() === req.user.userId;
    const isDoctor = req.user.role === 'doctor' && appointment.doctor._id.toString() === req.user.doctorId;
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Appointment retrieved successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
});

// Cancel appointment
router.patch('/:id/cancel', authenticateToken, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    const isPatient = appointment.patient.toString() === req.user.userId;
    const isDoctor = req.user.role === 'doctor' && appointment.doctor.toString() === req.user.doctorId;
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if appointment can be cancelled
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ message: 'Appointment cannot be cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
});

// Generate Agora token for call
router.post('/:id/generate-token', authenticateToken, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    const isPatient = appointment.patient.toString() === req.user.userId;
    const isDoctor = req.user.role === 'doctor' && appointment.doctor.toString() === req.user.doctorId;
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate Agora token (you'll need to implement this with Agora SDK)
    const agoraToken = generateAgoraToken(appointment.callRoomId, req.user.userId || req.user.doctorId);

    res.json({
      message: 'Token generated successfully',
      token: agoraToken,
      channelName: appointment.callRoomId,
      uid: req.user.userId || req.user.doctorId
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to generate Agora token
function generateAgoraToken(channelName, uid) {
  // This is a placeholder - you'll need to implement actual Agora token generation
  // For now, return a simple token (not recommended for production)
  const token = jwt.sign(
    { channelName, uid, role: 'publisher' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
}

module.exports = router;
