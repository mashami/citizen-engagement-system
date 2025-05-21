import AdminDashboard from "@/components/AdminDashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-black mb-6">
            Admin Dashboard
          </h1>
          <AdminDashboard />
        </div>
      </div>
    </main>
  );
}
