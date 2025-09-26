"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define a type for our user/staff data for better type safety
interface StaffMember {
  _id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // State to hold the array of staff members
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return; // Stop execution if no token is found
    }

    const fetchStaff = async () => {
      try {
        // --- FIX: Fetch from the new, correct, and secure API endpoint ---
        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            // Although the API route is not protected yet, it's best practice
            // to send the token for when you add authentication middleware.
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Handle HTTP errors like 404, 500 etc.
          throw new Error('Failed to fetch staff data.');
        }

        const data = await res.json();
        
        if (data.success) {
          // --- FIX: Set the 'users' array from the response to the state ---
          setStaff(data.users);
        } else {
          throw new Error(data.message || 'Could not retrieve staff.');
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        // --- FIX: Loading should stop regardless of success or failure ---
        setLoading(false);
      }
    };

    fetchStaff();
  }, [router]); // Dependency array is correct

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome to your Dashboard!</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
        
        <p className="text-gray-600">This is a protected page.</p>
        
        {/* Error Display */}
        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
          <p><span className="font-bold">Error:</span> {error}</p>
        </div>}

        {/* --- FIX: Correctly render the list of staff members --- */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Staff Members:</h2>
          {staff.length > 0 ? (
            <ul className="list-disc list-inside mt-4 space-y-2 bg-gray-50 p-4 rounded-md">
              {staff.map((member) => (
                <li key={member._id} className="text-gray-800">
                  <span className="font-semibold">{member.name}</span> - {member.email}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500">No staff members found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
