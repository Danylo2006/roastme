"use client";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Transaction Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Roasts</h2>
        <p className="text-gray-600">
          This is where you&apos;ll see a history of your transaction roasts.
        </p>
      </div>
    </div>
  );
}
