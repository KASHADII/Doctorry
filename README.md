# Doctorry - Healthcare Management System

A comprehensive healthcare management system with separate authentication for patients, doctors, and administrators.

## Features

### Patient Features
- User registration and login
- Personal dashboard
- Medical record management
- Profile management

### Admin Features
- Admin login at `/admin/login`
- Doctor management (add, edit, delete, activate/deactivate)
- Generate doctor credentials automatically
- View all doctors and their status

### Doctor Features
- Doctor login at `/doctor/login`
- Personal dashboard
- Profile management
- Password change functionality

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/doctorry
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

4. Start MongoDB (if not already running)

5. Create the default admin user:
```bash
node createAdmin.js
```

This will create a default admin with:
- Email: `admin@doctorry.com`
- Password: `admin123`

**Important**: Change the password after first login!

6. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Usage

### Admin Login
1. Go to `http://localhost:5173/admin/login`
2. Use the default credentials:
   - Email: `admin@doctorry.com`
   - Password: `admin123`
3. After login, you can:
   - Add new doctors
   - Manage existing doctors
   - View doctor status
   - Generate login credentials for doctors

### Doctor Login
1. Go to `http://localhost:5173/doctor/login`
2. Use the Doctor ID and password provided by the admin
3. After login, doctors can:
   - View their profile
   - Edit their information
   - Change their password

### Patient Registration/Login
1. Go to `http://localhost:5173/`
2. Click "Get Started" to register as a patient
3. Or click "Sign In" to login with existing credentials

## API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/doctors` - Create new doctor
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/doctors/:id` - Get single doctor
- `PATCH /api/admin/doctors/:id/status` - Update doctor status
- `DELETE /api/admin/doctors/:id` - Delete doctor

### Doctor Endpoints
- `POST /api/doctor/login` - Doctor login (uses doctorId instead of email)
- `GET /api/doctor/profile` - Get doctor profile
- `PUT /api/doctor/profile` - Update doctor profile
- `PUT /api/doctor/change-password` - Change password
- `POST /api/doctor/logout` - Doctor logout

### User Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Database Models

### Admin Model
- username, email, password
- firstName, lastName
- role (admin/super_admin)
- isActive

### Doctor Model
- doctorId (auto-generated, unique identifier - used for login)
- password (auto-generated)
- firstName, lastName
- specialization, qualification, experience
- phoneNumber, address, consultationFee
- availableSlots, isActive
- createdBy (admin reference)

### User Model
- mobileNumber, email, password
- firstName, lastName, dateOfBirth, gender
- address, emergencyContact
- medicalHistory, allergies, medications
- role (default: user)

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Authentication**: Secure token-based authentication
3. **Role-based Access**: Different access levels for users, doctors, and admins
4. **Input Validation**: Server-side validation for all inputs
5. **CORS Protection**: Configured CORS for security

## Default Credentials

### Admin
- Email: `admin@doctorry.com`
- Password: `admin123`

### Doctor
- Credentials are auto-generated when admin creates a doctor
- Format: `DOC{timestamp}{random}` for doctor ID
- Login: Use Doctor ID and auto-generated password

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env file

2. **Port Already in Use**
   - Change the PORT in .env file
   - Kill existing processes using the port

3. **Admin Creation Failed**
   - Run `node createAdmin.js` from server directory
   - Check MongoDB connection

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## Development Notes

- The system uses separate authentication for different user types
- Admin and doctor authentication is independent of the main user system
- All sensitive operations require proper authentication
- The system is designed to be scalable and maintainable

## Future Enhancements

- Appointment booking system
- Patient-doctor communication
- Medical record sharing
- Prescription management
- Notification system
- Mobile app support
