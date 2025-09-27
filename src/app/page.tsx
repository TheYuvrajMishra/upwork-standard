// src/app/login/page.js (or wherever your login page is located)
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/pages/dashboard');
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
  const handleSubmit = async (e:any) => { // Removed 'any' type
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('Role', data.role);
        router.push('/pages/tasks'); // Adjusted path for App Router convention
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    // Main container
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      {/* Form Card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-center text-red-600">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button 
              type="submit"
              className="w-full cursor-pointer px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              Login
            </button>
          </div>
          <span className='text-blue-500 cursor-pointer' onClick={()=>router.push("/pages/register")}>create an account</span>
        </form>
      </div>
    </div>
  );
}