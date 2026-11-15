import React from 'react';

export function Button({ variant, size, className, children }) {
  return <button className={`${variant} ${size} ${className}`}>{children}</button>;
}