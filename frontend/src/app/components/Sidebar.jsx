import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Users, FileText, X } from 'lucide-react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Upload Prescription', href: '/upload', icon: Upload },
    { name: 'Patient Records', href: '/patients', icon: Users },
    { name: 'Recent Analysis', href: '/analysis/demo', icon: FileText },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold text-lg">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">Quick Tip</p>
              <p className="mt-1 text-xs text-blue-700">
                Upload prescriptions in JPG, PNG, or PDF format for analysis.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
