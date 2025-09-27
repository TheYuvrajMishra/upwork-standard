"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const [staff, setStaff] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return; // Stop execution if no token is found
    }

    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle non-successful responses (e.g., 401, 403, 500)
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch staff data.");
        }

        const data = await res.json();
        setStaff(data.users);
      } catch (err: any) {
        // Set the error state to display it in the UI
        setError(err.message);
        console.error(err); // Log the full error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []); // Empty dependency array ensures this runs only once on mount
  return (
    <div className="flex">
      {/* tasks */}
      <div className="w-2/3">
        <div className="flex justify-between border-b border-b-black/5">
          <h1 className="text-3xl ">Tasks</h1>
          <button className="text-gray-500">+Add Task</button>
        </div>
      </div>

      {/* staff */}
      <div className="w-1/3 ml-5 h-full">
        <h1>Staff Members</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
        {/* CORRECTED: Check if length is 0 to show message */}
        {staff.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
            <ul>
                {staff.map((member: any) => (
                    <li key={member.id} className="mb-4">
                        <h2 className="text-lg font-semibold">{member.name}</h2>
                        <p className="text-gray-600">{member.email}</p>
                    </li>
                ))}
            </ul>
        )}
      </div>
      </div>
    </div>
  );
}

export default page;
