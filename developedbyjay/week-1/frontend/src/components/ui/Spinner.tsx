import React from "react";

const Spinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses: { [key: string]: string } = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses: { [key: string]: string } = {
    blue: "border-blue-600",
    gray: "border-gray-600",
    green: "border-green-600",
    red: "border-red-600",
    purple: "border-purple-600",
  };

  return (
    <div className="flex h-full mx-auto items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
