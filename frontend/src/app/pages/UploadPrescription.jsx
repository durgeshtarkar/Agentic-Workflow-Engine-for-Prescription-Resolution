import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrescriptionUploadForm } from '../components/PrescriptionUploadForm.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Upload, FileText, Image as ImageIcon, CheckCircle2, Shield, Zap } from 'lucide-react';

export function UploadPrescription() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Prescription</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload prescription images or enter prescription data for AI-powered analysis
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
                <p className="font-semibold text-gray-900 text-lg mb-1">Upload File</p>
                <p className="text-sm text-gray-600">Drag & drop or browse files</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-1">2</div>
                <p className="font-semibold text-gray-900 text-lg mb-1">Add Details</p>
                <p className="text-sm text-gray-600">Patient & prescription info</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-10 rounded-bl-full"></div>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">3</div>
                <p className="font-semibold text-gray-900 text-lg mb-1">Get Analysis</p>
                <p className="text-sm text-gray-600">Instant AI-powered results</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Upload Form */}
        <PrescriptionUploadForm />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </div>
              <CardDescription className="text-base">
                Your prescription data is encrypted and processed securely. We follow HIPAA compliance 
                standards for healthcare data protection.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl">Fast Analysis</CardTitle>
              </div>
              <CardDescription className="text-base">
                Get comprehensive prescription analysis in under 2 minutes. Our AI processes 
                thousands of data points instantly.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Supported Formats */}
        <Card className="mt-8 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Supported Formats</CardTitle>
            <CardDescription className="text-base">
              We accept the following file formats for prescription upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">JPG / JPEG</p>
                  <p className="text-xs text-gray-600">Image files</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">PNG</p>
                  <p className="text-xs text-gray-600">Image files</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">PDF</p>
                  <p className="text-xs text-gray-600">Document files</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 Tip:</strong> For best results, ensure images are clear, well-lit, and text is readable. 
                Maximum file size: 10MB per file.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
