/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Agency {
  id: string;
  name: string;
}
const CATEGORIES: Category[] = [
  { id: "1", name: "Roads and Infrastructure" },
  { id: "2", name: "Water Supply" },
  { id: "3", name: "Electricity" },
  { id: "4", name: "Waste Management" },
  { id: "5", name: "Public Transport" },
  { id: "6", name: "Healthcare" },
  { id: "7", name: "Education" },
  { id: "8", name: "Public Safety" },
  { id: "9", name: "Environment" },
  { id: "10", name: "Other" }
];

const AGENCIES: Agency[] = [
  { id: "1", name: "Department of Public Works" },
  { id: "2", name: "Water Authority" },
  { id: "3", name: "Electricity Board" },
  { id: "4", name: "Waste Management Department" },
  { id: "5", name: "Transport Authority" },
  { id: "6", name: "Health Department" },
  { id: "7", name: "Education Department" },
  { id: "8", name: "Police Department" },
  { id: "9", name: "Environmental Protection Agency" },
  { id: "10", name: "General Administration" }
];

const SubmitComplaint: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [agencies, setAgencies] = useState<Agency[]>(AGENCIES);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    agencyId: "",
    location: "",
    contactPhone: "",
    attachments: null as File[] | null
  });

  //   useEffect(() => {
  //     // Redirect to login if not authenticated
  //     if (status === "unauthenticated") {
  //       router.push("/api/auth/signin?callbackUrl=/submit");
  //     }

  //     if (status === "authenticated") {
  //       fetchData();
  //     }
  //   }, [status, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: Array.from(e.target.files as FileList)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create form data for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "attachments") {
          submitData.append(key, value as string);
        }
      });

      if (formData.attachments) {
        formData.attachments.forEach((file) => {
          submitData.append("attachments", file);
        });
      }

      const response = await fetch("/api/complaints", {
        method: "POST",
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit complaint");
      }

      const data = await response.json();
      setSuccess(true);
      setTrackingId(data.trackingId);

      // Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        agencyId: "",
        location: "",
        contactPhone: "",
        attachments: null
      });
    } catch (err) {
      setError(
        (err as Error).message ||
          "An error occurred while submitting your complaint"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-black mb-6">
            Submit a Complaint
          </h1>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Complaint Submitted Successfully
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Your complaint has been received and is being processed.
                    </p>
                    <p className="mt-1">
                      Your tracking ID:{" "}
                      <span className="font-bold">{trackingId}</span>
                    </p>
                    <p className="mt-2">
                      You can use this ID to track the status of your complaint.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/track?id=${trackingId}`}
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Track your complaint →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Complaint Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief title of your complaint"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide details about your complaint"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="agencyId"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Responsible Agency *
                  </label>
                  <select
                    id="agencyId"
                    name="agencyId"
                    value={formData.agencyId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an agency</option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Address or location related to the complaint"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your phone number for follow-up"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="attachments"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Attachments
                </label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  multiple
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can upload images, documents, or other files related to
                  your complaint (max 5MB each)
                </p>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/"
                  className="px-4 py-2 border border-gray-300 text-black rounded-md mr-2 hover:bg-gray-100"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
