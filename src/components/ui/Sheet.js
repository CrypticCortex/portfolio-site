import React from 'react';

export function Sheet({ children }) {
  return <div className="relative">{children}</div>;
}

export function SheetTrigger({ children }) {
  return <div className="cursor-pointer">{children}</div>;
}

export function SheetContent({ children, side }) {
  return <div className={`absolute ${side === 'right' ? 'right-0' : 'left-0'} bg-white p-4`}>{children}</div>;
}