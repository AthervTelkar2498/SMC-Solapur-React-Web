import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadService } from '../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const UploadContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const UploadModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const DropzoneArea = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#3b82f6' : '#d1d5db'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: ${props => props.isDragActive ? '#eff6ff' : '#f9fafb'};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const DropzoneIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.isDragActive ? '#3b82f6' : '#6b7280'};
`;

const DropzoneText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const DropzoneSubtext = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FileIcon = styled.div`
  color: #059669;
`;

const FileName = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const ResultSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background: ${props => props.success ? '#ecfdf5' : '#fef2f2'};
  border: 1px solid ${props => props.success ? '#a7f3d0' : '#fecaca'};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ResultTitle = styled.div`
  font-weight: 600;
  color: ${props => props.success ? '#065f46' : '#991b1b'};
`;

const ResultDetails = styled.div`
  font-size: 14px;
  color: ${props => props.success ? '#047857' : '#dc2626'};
  
  ul {
    margin: 8px 0 0 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
`;

const ExcelUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const result = await uploadService.uploadExcel(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadResult(result);
      toast.success(`Excel uploaded successfully! Processed ${result.summary.processedCount} records.`);
      
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Upload failed';
      setUploadResult({
        message: errorMessage,
        error: true
      });
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setUploadResult(null);
      setUploadProgress(0);
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <UploadContainer onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <UploadModal>
        <ModalHeader>
          <ModalTitle>Upload Excel File</ModalTitle>
          <CloseButton onClick={handleClose} disabled={uploading}>
            ×
          </CloseButton>
        </ModalHeader>

        {!selectedFile && (
          <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <DropzoneIcon isDragActive={isDragActive}>
              📄
            </DropzoneIcon>
            <DropzoneText>
              {isDragActive ? 'Drop the file here' : 'Drag & drop your Excel file here'}
            </DropzoneText>
            <DropzoneSubtext>
              or click to browse (Max 10MB, .xlsx or .xls files only)
            </DropzoneSubtext>
          </DropzoneArea>
        )}

        {selectedFile && (
          <FileInfo>
            <FileIcon>
              <FileText size={24} />
            </FileIcon>
            <FileName>{selectedFile.name}</FileName>
            <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
          </FileInfo>
        )}

        {uploading && (
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
              Uploading... {uploadProgress}%
            </div>
            <ProgressBar>
              <Progress progress={uploadProgress} />
            </ProgressBar>
          </div>
        )}

        {uploadResult && (
          <ResultSection success={!uploadResult.error}>
            <ResultHeader>
              {uploadResult.error ? (
                <AlertCircle size={20} color="#991b1b" />
              ) : (
                <CheckCircle size={20} color="#065f46" />
              )}
              <ResultTitle success={!uploadResult.error}>
                {uploadResult.error ? 'Upload Failed' : 'Upload Successful'}
              </ResultTitle>
            </ResultHeader>
            <ResultDetails success={!uploadResult.error}>
              {uploadResult.error ? (
                <div>{uploadResult.message}</div>
              ) : (
                <div>
                  <div>Total rows processed: {uploadResult.summary.processedCount}</div>
                  {uploadResult.summary.errorCount > 0 && (
                    <div>Errors: {uploadResult.summary.errorCount}</div>
                  )}
                  {uploadResult.summary.errors && uploadResult.summary.errors.length > 0 && (
                    <div>
                      <strong>Error details:</strong>
                      <ul>
                        {uploadResult.summary.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </ResultDetails>
          </ResultSection>
        )}

        <ButtonGroup>
          <Button type="button" className="secondary" onClick={handleClose} disabled={uploading}>
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          {selectedFile && !uploadResult && (
            <Button 
              type="button" 
              className="primary" 
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          )}
        </ButtonGroup>
      </UploadModal>
    </UploadContainer>
  );
};

export default ExcelUploadModal;