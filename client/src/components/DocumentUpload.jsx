import React, { useState } from 'react';

const DocumentUpload = ({ onDocumentsChange, requiredDocuments = 2 }) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  
  const documentTypes = [
    { value: 'aadhar', label: 'Aadhar Card', icon: '🆔' },
    { value: 'pan', label: 'PAN Card', icon: '💳' },
    { value: 'ayushman', label: 'Ayushman Card', icon: '🏥' },
    { value: 'other', label: 'Other Document', icon: '📄' }
  ];

  const handleFileSelect = (file, documentType) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only JPEG, PNG, or PDF files');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');

    // Convert file to base64 for storage
    const reader = new FileReader();
    reader.onload = () => {
      const newDocument = {
        id: Date.now(),
        type: documentType,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: reader.result, // Base64 data
        uploadedAt: new Date()
      };

      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      onDocumentsChange(updatedDocuments);
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
  };

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  const getDocumentIcon = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.icon : '📄';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
        <p className="text-sm text-gray-600">
          Please upload at least {requiredDocuments} documents for verification
        </p>
        {documents.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {documents.length} document{documents.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Document Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => (
          <div key={docType.value} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">{docType.icon}</div>
              <h4 className="font-medium text-gray-900 mb-2">{docType.label}</h4>
              
              <input
                type="file"
                id={`upload-${docType.value}`}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileSelect(file, docType.value);
                  }
                }}
                className="hidden"
              />
              
              <label
                htmlFor={`upload-${docType.value}`}
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Choose File
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Documents */}
      {documents.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Selected Documents</h4>
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
                <button
                  onClick={() => removeDocument(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {documents.length < requiredDocuments && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please select at least {requiredDocuments - documents.length} more document{requiredDocuments - documents.length !== 1 ? 's' : ''} to complete registration.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
