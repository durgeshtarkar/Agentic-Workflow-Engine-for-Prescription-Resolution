import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '../services/api.js';

export function PrescriptionUploadForm() {
  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success('File uploaded successfully');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !prescriptionText) {
      toast.error('Please upload a file or enter prescription text');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('patientName', patientName);
      formData.append('patientId', patientId);
      formData.append('prescriptionText', prescriptionText);

      const data = await apiService.uploadPrescription(formData);
      const analysisId = data.id || data._id || 'unknown';

      toast.success('Prescription uploaded successfully!');
      navigate(`/analysis/${analysisId}`);
    } catch (error) {
      toast.error(`Upload failed: ${error.message || 'Please try again.'}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription Upload</CardTitle>
        <CardDescription>
          Upload prescription image or enter prescription details manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                type="text"
                placeholder="John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                type="text"
                placeholder="P-12345"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Prescription Image/PDF</Label>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the file here...</p>
                ) : (
                  <>
                    <p className="text-gray-600 mb-2">
                      Drag & drop a prescription file here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Manual Text Entry */}
          <div className="space-y-2">
            <Label htmlFor="prescriptionText">
              Or Enter Prescription Details Manually (Optional)
            </Label>
            <Textarea
              id="prescriptionText"
              placeholder="Enter medication names, dosages, frequencies, etc."
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Analyze
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
