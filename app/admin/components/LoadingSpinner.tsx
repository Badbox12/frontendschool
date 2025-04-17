// components/LoadingSpinner.tsx
import { FC } from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  size = "md",
  color = "text-blue-500",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-black/20 z-50" : ""
      }`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`animate-spin rounded-full border-solid ${color} border-t-transparent ${
          sizeClasses[size]
        }`}
        style={{ animation: "spin 1s linear infinite" }}
      >
        {/* Screen reader text */}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;