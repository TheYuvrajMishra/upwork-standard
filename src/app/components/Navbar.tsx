"use client";
// Import 'usePathname' to read the current URL
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { 
  ClipboardCheck, 
  CalendarDays, 
  PenSquare, 
  Users, 
  Settings, 
  LogOut,
  LayoutGrid
} from "lucide-react";

const navLinks = [
  { name: "Tasks", icon: <ClipboardCheck size={18} />,path: "/pages/tasks"},
  { name: "Calendar", icon: <CalendarDays size={18} />,path: "/pages/calendar" },
  { name: "Notes", icon: <PenSquare size={18} />,path:"/pages/notes" },
  { name: "Staff Reports", icon: <Users size={18} />,path: "/pages/staff-reports" },
  { name: "Settings", icon: <Settings size={18} />,path: "/pages/settings" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Tasks");
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Get the current path from the URL
  const pathname = usePathname();

  // Define the paths where the navbar should be hidden
  const hiddenPaths = ["/", "/pages/register"];

  // If the current path is in our hidden list, render nothing.
  if (hiddenPaths.includes(pathname)) {
    return null;
  }


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // The rest of your component logic and JSX remains here
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b
      ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-xl border-gray-200 shadow-sm"
          : "py-6 bg-white/50 backdrop-blur-lg border-transparent"
      }`}
    >
      <div className="max-w-screen mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-start">
          {/* LEFT CONTENT */}
          <div
            className={`flex transition-all duration-500 ease-in-out ${
              isScrolled
                ? "flex-row items-center gap-x-8"
                : "flex-col items-start gap-y-5"
            }`}
          >
            {/* LOGO / TITLE */}
            <div className="flex items-center gap-3">
              <LayoutGrid
                className={`transition-all duration-500 ease-in-out text-blue-400 ${
                  isScrolled ? "h-8 w-8" : "h-12 w-12"
                }`}
              />
              <h1
                className={`font-regular text-gray-800 transition-all duration-500 ease-in-out ${
                  isScrolled ? "text-2xl" : "text-5xl"
                }`}
              >
                Company Dashboard
              </h1>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center flex-wrap gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {setActiveLink(link.name)
                    router.push(link.path)
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-3  font-medium transition-all duration-300 transform
                  ${isScrolled ? "py-2 text-sm" : "py-3 text-base"}
                  ${
                    activeLink === link.name
                      ? "bg-blue-400 text-white shadow"
                      : "text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT (Logout Button) */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-3  cursor-pointer font-medium transition-all duration-300 transform text-gray-500 bg-gray-100 hover:bg-red-500 hover:text-white
            ${isScrolled ? "py-2 text-sm" : "py-3 text-base"}`}
          >
            <LogOut size={18} />
            <span className={`${isScrolled ? 'hidden xl:inline' : 'inline'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;