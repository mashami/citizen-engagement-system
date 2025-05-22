import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginButton from "@/components/LoginButton";
import StatsDashboard from "@/components/StatsDashboard";
import RecentComplaints from "@/components/RecentComplaints";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">
            Citizen Engagement System
          </h1>
          <LoginButton session={session} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Welcome to the Citizen Engagement Portal
          </h2>
          <p className="text-black mb-6">
            Our platform allows you to submit complaints or feedback about
            public services and track their status. Your voice matters in
            improving government services.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href="/submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-center hover:bg-blue-700 transition-colors"
            >
              Submit a Complaint
            </Link>
            <Link
              href="/track"
              className="bg-gray-200 text-black px-6 py-3 rounded-md font-medium text-center hover:bg-gray-300 transition-colors"
            >
              Track Your Complaint
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium text-center hover:bg-purple-700 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <StatsDashboard />
          <RecentComplaints />
        </div>
      </div>
    </main>
  );
}
