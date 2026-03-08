import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnalysisResultCard } from '../components/AnalysisResultCard.jsx';
import { AlertBox } from '../components/AlertBox.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../services/api.js';

const emptyData = null;

export function AnalysisResults() {
  const { id } = useParams();
  const [data, setData] = useState(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    apiService
      .getAnalysis(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load analysis');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const getRiskBadge = (risk) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return styles[risk] || styles.low;
  };

  const getRiskIcon = (risk) => {
    if (risk === 'high') return <XCircle className="h-5 w-5" />;
    if (risk === 'medium') return <AlertTriangle className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No analysis data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/patients">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient Records
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analysis Results
              </h1>
              <p className="text-gray-600">
                Patient: {data.patient_name || data.patientName || 'Unknown'} ({data.patient_id || data.patientId || ''})
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Risk Level Summary */}
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  {getRiskIcon(data.riskLevel || data.risk_level || 'low')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Overall Risk Assessment</h3>
                  <p className="text-sm text-gray-600">
                    Analyzed on {new Date(data.uploadDate || data.created_at || '').toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge className={getRiskBadge(data.riskLevel || data.risk_level || 'low')}>
                {(data.riskLevel || data.risk_level || 'low').toString().toUpperCase()} RISK
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alerts & Warnings</h2>
          <div className="space-y-4">
            {(data.alerts || data.alert || []).map((alert, index) => (
              <AlertBox key={index} alert={alert} />
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Medications</CardTitle>
              <CardDescription>
                {(data.medications || []).length} medication(s) identified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data.medications || []).map((med, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{med.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Dosage:</span>
                        <p className="font-medium">{med.dosage}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="font-medium">{med.frequency}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Route:</span>
                        <p className="font-medium">{med.route}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{med.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations & Contraindications */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Clinical recommendations for this prescription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(data.recommendations || []).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contraindications</CardTitle>
                <CardDescription>
                  Important warnings and contraindications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(data.contraindications || []).map((contra, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{contra}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
