import React from "react";

const SkenletonLoader = () => {
  return (
    <div className=" animate-pulse w-full">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
        <div className="p-4 space-y-4">
          {/* Table Header Skeleton */}
          <div className="hidden md:flex justify-between bg-gray-300 dark:bg-gray-600 rounded-t-lg p-3 space-x-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-full"
              ></div>
            ))}
          </div>
          {/* Table Rows Skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between p-3 space-y-2 md:space-y-0 md:space-x-4 border-b dark:border-gray-600"
              >
                {[...Array(8)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkenletonLoader;
