# Cloudinary Configuration

To use the document upload feature, you need to configure Cloudinary. Follow these steps:

## 1. Create a Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your Cloud Name, API Key, and API Secret from the dashboard

## 2. Environment Variables
Add these environment variables to your `server/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 3. Example Configuration
```env
CLOUDINARY_CLOUD_NAME=doctorry-app
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## 4. Features
- **File Types**: JPEG, PNG, PDF
- **File Size**: Maximum 5MB per file
- **Storage**: Files are stored in the `doctorry-documents` folder
- **Security**: Only authenticated users can upload documents
- **Validation**: Server-side validation for file types and sizes

## 5. Document Types Supported
- Aadhar Card
- PAN Card  
- Ayushman Card
- Other Documents

## 6. API Endpoints
- `POST /api/auth/upload-document` - Upload a document
- `GET /api/auth/documents` - Get user's documents
- `DELETE /api/auth/documents/:id` - Delete a document

## 7. Frontend Integration
The DocumentUpload component handles:
- File selection and validation
- Upload progress indication
- Error handling
- Document preview and management
- Mandatory document requirements (minimum 2 documents)

## 8. Testing
1. Start your server: `npm run dev`
2. Go to the registration page
3. Fill in personal information
4. Upload at least 2 documents
5. Complete registration

## 9. Troubleshooting
- Make sure Cloudinary credentials are correct
- Check file size limits (5MB max)
- Ensure file types are supported (JPEG, PNG, PDF)
- Verify network connectivity for uploads

