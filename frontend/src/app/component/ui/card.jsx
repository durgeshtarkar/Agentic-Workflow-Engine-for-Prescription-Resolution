import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white shadow rounded ${className}`}>{children}</div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
  );
}
