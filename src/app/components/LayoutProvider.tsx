// app/components/LayoutWrapper.tsx

"use client"; // ✨ This is crucial!

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Adjust the import path if needed
import React from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define the paths where you DON'T want the navbar
  const pathsWithoutNavbar = ["/", "/pages/register"];

  // Check if the current path is one of the paths to hide the navbar on
  const shouldShowNavbar = !pathsWithoutNavbar.includes(pathname);

  return (
    <>
      {/* Conditionally render the Navbar */}
      {shouldShowNavbar && <Navbar />}

      {/* Conditionally apply padding to the main content area */}
      <main className={`p-5 ${shouldShowNavbar ? "md:pt-45 pt-30" : ""}`}>
        {children}
      </main>
    </>
  );
}