import React from "react";

interface SeparatorWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SeparatorWithText({ children }: SeparatorWithTextProps) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-b border-gray-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-sm text-gray-500">{children}</span>
      </div>
    </div>
  );
}
