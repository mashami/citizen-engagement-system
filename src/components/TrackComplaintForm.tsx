"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Complaint } from "@prisma/client";
import ComplaintDetails from "./ComplaintDetails";

const TrackComplaintForm: React.FC = () => {
  const searchParams = useSearchParams();
  const initialTrackingId = searchParams?.get("id") || "";

  const [trackingId, setTrackingId] = useState<string>(initialTrackingId);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const response = await fetch(
        `/api/complaints/track?trackingId=${encodeURIComponent(trackingId)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No complaint found with this tracking ID");
        }
        throw new Error("Failed to fetch complaint details");
      }

      const data = await response.json();
      setComplaint(data);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // If we have an initial tracking ID from URL params, search automatically on mount
  useState(() => {
    if (initialTrackingId) {
      handleSubmit(new Event("submit") as unknown as FormEvent);
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="trackingId" className="sr-only">
              Tracking ID
            </label>
            <input
              type="text"
              id="trackingId"
              name="trackingId"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter your tracking ID"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Searching..." : "Track Complaint"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {complaint && <ComplaintDetails complaint={complaint} />}

      {searched && !complaint && !error && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">
            No complaint found with the provided tracking ID. Please check and
            try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackComplaintForm;
