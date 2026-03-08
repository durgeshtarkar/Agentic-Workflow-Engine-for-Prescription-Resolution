import React from 'react';

export function Alert({ children, className = '', ...props }) {
  return (
    <div className={`border rounded p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = '', ...props }) {
  return (
    <h4 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h4>
  );
}

export function AlertDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm ${className}`} {...props}>
      {children}
    </p>
  );
}
