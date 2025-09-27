import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostRegistrationUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  
  const { uploadDocument, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get pending documents from localStorage
    const pendingDocs = localStorage.getItem('pendingDocuments');
    if (pendingDocs) {
      setDocuments(JSON.parse(pendingDocs));
    } else {
      // No pending documents, redirect to dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const uploadAllDocuments = async () => {
    if (documents.length === 0) return;

    setUploading(true);
    setError('');
    let successCount = 0;

    try {
      for (const doc of documents) {
        if (doc.fileData) {
          // Convert base64 back to File object
          const file = dataURLtoFile(doc.fileData, doc.fileName, doc.fileType);
          const result = await uploadDocument(file, doc.type);
          if (result.success) {
            successCount++;
            setUploadedCount(successCount);
          } else {
            setError(`Failed to upload ${doc.fileName}: ${result.message}`);
            break;
          }
        }
      }

      if (successCount === documents.length) {
        setSuccess(true);
        // Clear pending documents
        localStorage.removeItem('pendingDocuments');
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Helper function to convert dataURL to File
  const dataURLtoFile = (dataurl, filename, mimeType) => {
    const arr = dataurl.split(',');
    const mime = mimeType || arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const skipUpload = () => {
    localStorage.removeItem('pendingDocuments');
    navigate('/dashboard');
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'aadhar': 'Aadhar Card',
      'pan': 'PAN Card',
      'ayushman': 'Ayushman Card',
      'other': 'Other Document'
    };
    return labels[type] || type;
  };

  const getDocumentIcon = (type) => {
    const icons = {
      'aadhar': '🆔',
      'pan': '💳',
      'ayushman': '🏥',
      'other': '📄'
    };
    return icons[type] || '📄';
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents Uploaded Successfully!</h2>
          <p className="text-gray-600 mb-4">
            All {documents.length} documents have been uploaded and verified.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Documents</h2>
          <p className="text-gray-600">
            Complete your registration by uploading the documents you selected.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Documents List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Documents</h3>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getDocumentIcon(doc.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{getDocumentTypeLabel(doc.type)}</p>
                    <p className="text-sm text-gray-600">{doc.fileName}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {index < uploadedCount ? (
                    <span className="text-green-600">✓ Uploaded</span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading documents...</span>
              <span>{uploadedCount}/{documents.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={skipUpload}
            disabled={uploading}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip for Now
          </button>
          
          <button
            onClick={uploadAllDocuments}
            disabled={uploading || !token}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </div>

        {!token && (
          <p className="text-sm text-red-600 mt-2 text-center">
            Please log in to upload documents.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostRegistrationUpload;
