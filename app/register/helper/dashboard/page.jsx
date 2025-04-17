// app/helper/dashboard/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function HelperDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(true);

  // Assume user ID is in localStorage (or you can use NextAuth session)
  const helperId = typeof window !== "undefined" ? localStorage.getItem("selectedHelperId") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/helper/${helperId}/dashboard`);
        const data = await res.json();
        console.log(data,"data")
        setStats(data);
        setAvailability(data?.basicInfo?.availability ?? true);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (helperId) fetchData();
  }, [helperId]);

  const toggleAvailability = async () => {
    try {
      const res = await fetch(`/api/helper/${helperId}/toggle-availability`, {
        method: "PUT",
      });
      const data = await res.json();
      setAvailability(data.availability);
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };

  if (loading) return <p className="p-8 text-lg">Loading dashboard...</p>;

  if (!stats) return <p className="p-8 text-red-500">Failed to load dashboard.</p>;

  const { basicInfo, totalEarnings, averageRating, highestRating, totalJobs, jobBreakdown, latestReviews } = stats;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Helper Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
          <p><strong>Name:</strong> {basicInfo.name}</p>
          <p><strong>Email:</strong> {basicInfo.email}</p>
          <p><strong>Phone:</strong> {basicInfo.phone}</p>
          <p><strong>Service Type:</strong> {basicInfo.serviceType}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Stats</h2>
          <p><strong>Total Earnings:</strong> ₹{totalEarnings}</p>
          <p><strong>Average Rating:</strong> ⭐ {averageRating}</p>
          <p><strong>Highest Rating:</strong> ⭐ {highestRating}</p>
          <p><strong>Total Jobs:</strong> {totalJobs}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Job Breakdown</h2>
          <ul className="list-disc ml-5">
            <li>Mechanic: {jobBreakdown.mechanic}</li>
            <li>Fuel: {jobBreakdown.fuel}</li>
            <li>Tow: {jobBreakdown.tow}</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Availability</h2>
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
              availability ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {availability ? "Available (Click to go Offline)" : "Offline (Click to go Online)"}
          </button>
        </div>
      </div>

      <div className="mt-10 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Latest Reviews</h2>
        {latestReviews?.length > 0 ? (
          latestReviews.map((review, index) => (
            <div key={index} className="mb-2 border-b pb-2">
              <p className="text-sm">⭐ {review.rating} - {review.comment}</p>
              <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600 italic">Live notifications coming soon...</div>
    </div>
  );
}
