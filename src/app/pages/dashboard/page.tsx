"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [router]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  const handleLogout=()=>{
    localStorage.removeItem('token');
    router.push('/');
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
      <p className="mt-4">This is a protected page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}