"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ComplaintDetail {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  status: string;
  category: string;
  agency: string;
  location: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  responses: Array<{
    id: string;
    message: string;
    createdAt: string;
    respondent: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  timeline: Array<{
    id: string;
    status: string;
    note: string | null;
    createdAt: string;
  }>;
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
}

const ComplaintDetail: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [responseText, setResponseText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const [statusUpdate, setStatusUpdate] = useState<{
    status: string;
    note: string;
  }>({
    status: "",
    note: ""
  });
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (status === "unauthenticated") {
      router.push(
        "/api/auth/signin?callbackUrl=/admin/complaints/" + complaintId
      );
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchComplaintDetails();
    }
  }, [status, session, router, complaintId]);

  const fetchComplaintDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/complaints/${complaintId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Complaint not found");
        }
        throw new Error("Failed to fetch complaint details");
      }

      const data = await response.json();
      setComplaint(data);

      // Initialize status update form with current status
      setStatusUpdate((prev) => ({
        ...prev,
        status: data.status
      }));
    } catch (err) {
      setError(
        (err as Error).message ||
          "An error occurred while fetching the complaint details"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!responseText.trim()) {
      setResponseError("Response cannot be empty");
      return;
    }

    setSubmitting(true);
    setResponseError(null);

    try {
      const response = await fetch(
        `/api/admin/complaints/${complaintId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: responseText
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit response");
      }

      // Clear form and refresh complaint details
      setResponseText("");
      fetchComplaintDetails();
    } catch (err) {
      setResponseError(
        (err as Error).message ||
          "An error occurred while submitting your response"
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!statusUpdate.status) {
      setStatusError("Please select a status");
      return;
    }

    setUpdatingStatus(true);
    setStatusError(null);

    try {
      const response = await fetch(
        `/api/admin/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: statusUpdate.status,
            note: statusUpdate.note
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Clear note field and refresh complaint details
      setStatusUpdate((prev) => ({
        ...prev,
        note: ""
      }));
      fetchComplaintDetails();
    } catch (err) {
      setStatusError(
        (err as Error).message || "An error occurred while updating the status"
      );
      console.error(err);
    } finally {
      setUpdatingStatus(false);
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <svg
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Error
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Complaint Details</h1>
            <Link
              href="/admin"
              className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {complaint.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tracking ID:{" "}
                  <span className="font-medium">{complaint.trackingId}</span>
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Submitted By
                </h3>
                <p className="text-black">{complaint.user.name || "N/A"}</p>
                <p className="text-black">{complaint.user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Submission Date
                </h3>
                <p className="text-black">
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-black">{complaint.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Agency</h3>
                <p className="text-black">{complaint.agency}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-black">
                  {complaint.location || "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Contact Phone
                </h3>
                <p className="text-black">
                  {complaint.contactPhone || "Not provided"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-black whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>
            </div>

            {complaint.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Attachments
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {complaint.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        <span className="text-sm text-black truncate">
                          {attachment.filename}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-black mb-4">
                Update Status
              </h2>
              <form onSubmit={handleStatusUpdate}>
                {statusError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {statusError}
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusUpdate.status}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        status: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Note (Optional)
                  </label>
                  <textarea
                    id="note"
                    value={statusUpdate.note}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        note: e.target.value
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a note about this status change"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    updatingStatus ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-black mb-4">
                Add Response
              </h2>
              <form onSubmit={handleResponseSubmit}>
                {responseError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {responseError}
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="response"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Response Message
                  </label>
                  <textarea
                    id="response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your response to the citizen"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Response"}
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-black mb-4">
                Timeline
              </h2>
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-black mb-4">
                Responses
              </h2>
              {complaint.responses.length === 0 ? (
                <p className="text-gray-500 italic">No responses yet.</p>
              ) : (
                <div className="space-y-4">
                  {complaint.responses.map((response) => (
                    <div
                      key={response.id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-black">
                          {response.respondent.name ||
                            response.respondent.email}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
