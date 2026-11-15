import React from 'react';

export function Avatar({ className, children }) {
  return <div className={`w-16 h-16 border ${className}`}>{children}</div>;
}

export function AvatarImage({ src }) {
  return <img src={src} className="w-full h-full object-cover" />;
}

export function AvatarFallback({ children }) {
  return <div className="w-full h-full flex items-center justify-center">{children}</div>;
}