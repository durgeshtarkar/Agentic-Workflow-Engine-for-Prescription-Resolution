import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function AlertBox({ alert }) {
  const getAlertStyles = () => {
    switch (alert.type) {
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getIcon = () => {
    switch (alert.type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Alert className={`${getAlertStyles()} border-l-4`}>
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <AlertTitle className="mb-2">{alert.title}</AlertTitle>
          <AlertDescription className="text-sm mb-2">
            {alert.description}
          </AlertDescription>
          <div className="mt-3 p-3 bg-white rounded-md border">
            <p className="text-sm font-medium text-gray-900 mb-1">Recommendation:</p>
            <p className="text-sm text-gray-700">{alert.recommendation}</p>
          </div>
        </div>
      </div>
    </Alert>
  );
}
