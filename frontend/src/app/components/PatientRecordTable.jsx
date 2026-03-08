import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, FileText } from 'lucide-react';

export function PatientRecordTable({ records }) {
  const getRiskBadge = (risk) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return styles[risk] || styles.low;
  };

  const getStatusBadge = (status) => {
    return status === 'Active'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800';
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">No patient records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Prescriptions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.patientId}</TableCell>
              <TableCell>{record.patientName}</TableCell>
              <TableCell>{record.age}</TableCell>
              <TableCell>{record.gender}</TableCell>
              <TableCell>{new Date(record.lastVisit).toLocaleDateString()}</TableCell>
              <TableCell>{record.prescriptions}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(record.status)}>
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getRiskBadge(record.riskLevel)}>
                  {record.riskLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <Link to={`/analysis/${record.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
