import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function AnalysisResultCard({ data }) {
  const getRiskBadge = (risk) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return styles[risk] || styles.low;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{data.patientName}</CardTitle>
            <CardDescription>Analysis ID: {data.id}</CardDescription>
          </div>
          <Badge className={getRiskBadge(data.riskLevel)}>
            {data.riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Medications</p>
            <p className="font-semibold text-gray-900">{data.medications}</p>
          </div>
          <div>
            <p className="text-gray-600">Alerts</p>
            <p className="font-semibold text-gray-900">{data.alerts}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
