import React from 'react';

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, ...props }) {
  // wrapper for compatibility
  return <div {...props}>{children}</div>;
}

export function SelectValue({ children, ...props }) {
  return <span {...props}>{children}</span>;
}

export function SelectContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectItem({ children, ...props }) {
  return <option {...props}>{children}</option>;
}
