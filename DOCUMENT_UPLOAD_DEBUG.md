# Document Upload Troubleshooting Guide

## Issue: "Failed to upload" error after document selection

### Root Cause
The main issue was that **File objects cannot be serialized to JSON** and stored in localStorage. When documents were stored with `JSON.stringify()`, the File objects were lost.

### Solution Implemented
1. **Convert files to base64** during selection
2. **Store base64 data** in localStorage
3. **Convert back to File objects** during upload
4. **Added debugging logs** to identify issues

### Debugging Steps

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for upload logs and errors

2. **Check Server Console**:
   - Look at your server terminal
   - Check for upload request logs

3. **Verify Cloudinary Setup**:
   - Make sure you have a `.env` file in the `server` folder
   - Add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Common Issues & Solutions

#### 1. Cloudinary Not Configured
**Error**: "Invalid cloud name" or "Unauthorized"
**Solution**: 
- Create free Cloudinary account at cloudinary.com
- Get credentials from dashboard
- Add to server/.env file

#### 2. File Size Too Large
**Error**: "File too large"
**Solution**: 
- Reduce file size to under 5MB
- Compress images before upload

#### 3. Invalid File Type
**Error**: "Invalid file type"
**Solution**: 
- Only upload JPEG, PNG, or PDF files
- Check file extension and MIME type

#### 4. Network Issues
**Error**: "Network error"
**Solution**: 
- Check internet connection
- Verify server is running
- Check CORS settings

### Testing Without Cloudinary

If you want to test without Cloudinary setup, you can temporarily modify the upload endpoint to save files locally:

```javascript
// In server/routes/auth.js, replace the upload endpoint with:
router.post('/upload-document', authenticateToken, async (req, res, next) => {
  try {
    // Mock successful upload for testing
    const documentData = {
      type: req.body.documentType,
      url: 'https://via.placeholder.com/300x200?text=Mock+Document',
      fileName: 'test-document.pdf',
      uploadedAt: new Date()
    };
    
    res.json({
      message: 'Document uploaded successfully (mock)',
      document: documentData
    });
  } catch (error) {
    next(error);
  }
});
```

### Next Steps

1. **Test the upload** with debugging enabled
2. **Check console logs** for specific error messages
3. **Verify Cloudinary credentials** if using cloud storage
4. **Use mock upload** for testing if needed

The file handling issue has been fixed, so uploads should work once Cloudinary is properly configured or mock upload is enabled.

