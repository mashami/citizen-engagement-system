"use client";

import { useEffect, useState } from "react";

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
  };
}

const ComplaintStats: React.FC<StatsProps> = ({ stats }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-black mb-4">
        Complaint Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Complaints</p>
          <p className="text-2xl font-bold text-black">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-black">{stats.pending}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-black">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Resolved</p>
          <p className="text-2xl font-bold text-black">{stats.resolved}</p>
        </div>
      </div>

      {stats.categories.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-black mb-2">
            Top Categories
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.categories.slice(0, 6).map((category, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{category.name}</p>
                <p className="text-lg font-semibold text-black">
                  {category.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintStats;
