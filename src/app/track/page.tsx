"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface ComplaintStatus {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  status: string;
  category: string;
  agency: string;
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: string;
    message: string;
    createdAt: string;
    respondentName: string;
  }>;
  timeline: Array<{
    id: string;
    status: string;
    createdAt: string;
    note?: string;
  }>;
}

const TrackComplaint: React.FC = () => {
  const searchParams = useSearchParams();
  const initialTrackingId = searchParams.get("id") || "";

  const [trackingId, setTrackingId] = useState<string>(initialTrackingId);
  const [complaint, setComplaint] = useState<ComplaintStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  useEffect(() => {
    if (initialTrackingId) {
      handleSearch();
    }
  }, [initialTrackingId]);

  const handleSearch = async (): Promise<void> => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const response = await fetch(`/api/complaints/track?id=${trackingId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Complaint not found. Please check your tracking ID and try again."
          );
        }
        throw new Error("Failed to fetch complaint status");
      }

      const data = await response.json();
      setComplaint(data);
      setSearched(true);
    } catch (err) {
      setError(
        (err as Error).message ||
          "An error occurred while fetching the complaint status"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-black mb-6">
              Track Your Complaint
            </h1>

            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>

          {searched && !loading && !error && !complaint && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-black">
                  No complaint found
                </h3>
                <p className="mt-1 text-gray-500">
                  We couldn&apos;t find a complaint with the tracking ID you
                  provided.
                </p>
                <div className="mt-6">
                  <Link
                    href="/submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit a new complaint
                  </Link>
                </div>
              </div>
            </div>
          )}

          {complaint && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-black">
                    {complaint.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tracking ID:{" "}
                  <span className="font-medium">{complaint.trackingId}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {complaint.category}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {complaint.agency}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Submitted:{" "}
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-black mb-2">
                  Description
                </h3>
                <p className="text-black whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-black mb-4">
                  Timeline
                </h3>
                <div className="relative">
                  {complaint.timeline.map((event, index) => (
                    <div key={event.id} className="relative pb-8">
                      {index < complaint.timeline.length - 1 && (
                        <div
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></div>
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div
                            className={`relative px-1 ${getStatusColor(
                              event.status
                            )} h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white`}
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-black">
                              {event.status}
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {new Date(event.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {event.note && (
                            <div className="mt-2 text-sm text-black">
                              <p>{event.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-4">
                  Responses
                </h3>
                {complaint.responses.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No responses yet. Please check back later.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {complaint.responses.map((response) => (
                      <div
                        key={response.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-black">
                            {response.respondentName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(response.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2 text-black whitespace-pre-line">
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  ← Back to Home
                </Link>
                <Link
                  href="/submit"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Submit Another Complaint
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;
