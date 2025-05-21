import Link from "next/link";
import { Complaint } from "@prisma/client";
import RecentComplaints from "@/components/RecentComplaints";
import ComplaintStats from "@/components/ComplaintStats";

export default async function Home() {
  // Fetch recent complaints and stats
  const recentComplaintsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/complaints?limit=5`,
    { cache: "no-store" }
  );
  const statsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/complaints/stats`,
    { cache: "no-store" }
  );

  let recentComplaints: Complaint[] = [];
  let stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    categories: []
  };

  if (recentComplaintsResponse.ok) {
    recentComplaints = await recentComplaintsResponse.json();
  }

  if (statsResponse.ok) {
    stats = await statsResponse.json();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-black">
                  Citizen Engagement System
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/submit"
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit Complaint
              </Link>
              <Link
                href="/dashboard"
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-3xl font-bold text-black mb-6">
              Welcome to the Citizen Engagement System
            </h2>
            <p className="text-lg text-black mb-6">
              This platform allows citizens to submit complaints or feedback on
              public services. Your submissions will be routed to the
              appropriate government agency for review and action.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-black mb-4">
                  How It Works
                </h3>
                <ol className="list-decimal list-inside text-black space-y-2">
                  <li>Submit your complaint or feedback</li>
                  <li>Receive a tracking number</li>
                  <li>
                    Your submission is categorized and routed to the appropriate
                    agency
                  </li>
                  <li>Track the status of your complaint</li>
                  <li>Receive updates and responses from the agency</li>
                </ol>
                <div className="mt-6">
                  <Link
                    href="/submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Submit a Complaint
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-black mb-4">
                  Track Your Complaint
                </h3>
                <p className="text-black mb-4">
                  Already submitted a complaint? Enter your tracking number to
                  check its status.
                </p>
                <div className="mt-4">
                  <Link
                    href="/track"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Track Complaint
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <ComplaintStats stats={stats} />
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-black mb-4">
                Recent Complaints
              </h3>
              <RecentComplaints complaints={recentComplaints} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
