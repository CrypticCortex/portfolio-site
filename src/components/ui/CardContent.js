import React from "react";

export function CardContent({ children }) {
  return (
    <div className="p-6 flex flex-col justify-between h-full">
      {children}
    </div>
  );
}
