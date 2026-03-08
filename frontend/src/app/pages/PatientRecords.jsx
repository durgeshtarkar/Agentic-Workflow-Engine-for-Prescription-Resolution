import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PatientRecordTable } from '../components/PatientRecordTable.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Filter, Download, Users } from 'lucide-react';
import { apiService } from '../services/api.js';

export function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchPatients();
    } else {
      try {
        const results = await apiService.searchPatients(query);
        setRecords(results.map((r) => ({
          id: r.patientId,
          patientId: r.patientId,
          patientName: r.patientName,
          age: '-',
          gender: '-',
          lastVisit: '-',
          prescriptions: '-',
          status: 'Active',
          riskLevel: 'low',
        })));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await apiService.getPatientRecords();
      setRecords(
        list.map((r, idx) => ({
          id: idx.toString(),
          patientId: r.patientId,
          patientName: r.patientName,
          age: '-',
          gender: '-',
          lastVisit: '-',
          prescriptions: '-',
          status: 'Active',
          riskLevel: 'low',
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const stats = [
    { label: 'Total Patients', value: records.length, icon: Users },
    { label: 'Active Cases', value: records.filter(r => r.status === 'Active').length, icon: Users },
    { label: 'High Risk', value: records.filter(r => r.riskLevel === 'high').length, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
          <p className="text-gray-600">
            Manage and view all patient prescription records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>
              Find patient records by name or patient ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Records Table */}
        {isLoading ? (
          <p>Loading patients...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Patients</CardTitle>
              <CardDescription>
                {records.length} patient record(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientRecordTable records={records} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
