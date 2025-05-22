/* eslint-disable prefer-const */
"use client";

import { useState, useEffect } from "react";
import { Complaint } from "@prisma/client";
import DashboardStats from "./DashboardStats";
import ComplaintList from "./ComplaintList";
import ComplaintFilter from "./ComplaintFilter";

interface FilterOptions {
  status: string;
  category: string;
  agency: string;
  dateRange: string;
  searchQuery: string;
}

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    categories: []
  });
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    category: "",
    agency: "",
    dateRange: "",
    searchQuery: ""
  });

  // Fetch complaints and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsResponse, statsResponse] = await Promise.all([
          fetch("/api/complaints"),
          fetch("/api/complaints/stats")
        ]);

        if (!complaintsResponse.ok || !statsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const complaintsData = await complaintsResponse.json();
        const statsData = await statsResponse.json();

        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        setStats(statsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let result = [...complaints];

    // Filter by status
    if (filters.status) {
      result = result.filter(
        (complaint) => complaint.status === filters.status
      );
    }

    // Filter by category
    if (filters.category) {
      result = result.filter(
        (complaint) => complaint.category === filters.category
      );
    }

    // Filter by agency
    if (filters.agency) {
      result = result.filter(
        (complaint) => complaint.agency === filters.agency
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      result = result.filter(
        (complaint) => new Date(complaint.createdAt) >= startDate
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(query) ||
          complaint.description.toLowerCase().includes(query) ||
          complaint.trackingId.toLowerCase().includes(query) ||
          complaint.location.toLowerCase().includes(query)
      );
    }

    setFilteredComplaints(result);
  }, [filters, complaints]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleStatusUpdate = async (
    complaintId: string,
    newStatus: string,
    response?: string
  ) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus,
          response: response || undefined,
          responseDate: new Date().toISOString()
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update complaint status");
      }

      // Update the local state
      const updatedComplaint = await res.json();
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId ? updatedComplaint : complaint
        )
      );

      // Refresh stats
      const statsResponse = await fetch("/api/complaints/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      return true;
    } catch (error) {
      console.error("Error updating complaint status:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <DashboardStats stats={stats} />

      <div className="mt-8">
        <ComplaintFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="mt-6">
        <ComplaintList
          complaints={filteredComplaints}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
