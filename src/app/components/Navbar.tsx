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
  LayoutGrid,
  Menu,
  X,
  ChevronRight,
  Home
} from "lucide-react";

const navLinks = [
  { name: "Tasks", icon: <ClipboardCheck size={18} />, path: "/pages/tasks" },
  { name: "Calendar", icon: <CalendarDays size={18} />, path: "/pages/calendar" },
  { name: "Notes", icon: <PenSquare size={18} />, path: "/pages/notes" },
  { name: "Staff Reports", icon: <Users size={18} />, path: "/pages/staff-reports" },
  { name: "Settings", icon: <Settings size={18} />, path: "/pages/settings" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Tasks");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  // Get the current path from the URL
  const pathname = usePathname();

  // Update active link based on current path
  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === pathname);
    if (currentLink) {
      setActiveLink(currentLink.name);
    }
  }, [pathname]);

  // Define the paths where the navbar should be hidden
  const hiddenPaths = ["/", "/pages/register"];

  // If the current path is in our hidden list, render nothing.
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (link) => {
    setActiveLink(link.name);
    router.push(link.path);
    setIsMobileMenuOpen(false);
  };

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [{ name: 'Home', path: '/dashboard' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (segment !== 'pages') {
        const formattedName = segment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        breadcrumbs.push({ name: formattedName, path: currentPath });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b
        ${
          isScrolled
            ? "py-3 bg-white/80 backdrop-blur-xl border-gray-200 shadow-sm"
            : "py-6 bg-white/50 backdrop-blur-lg border-transparent"
        }`}
      >
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
          {/* DESKTOP VIEW - Hidden on mobile (lg and up) */}
          <div className="hidden lg:flex justify-between items-start">
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
                    onClick={() => handleNavigation(link)}
                    className={`flex cursor-pointer items-center gap-2 px-3 font-medium transition-all duration-300 transform rounded-lg
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
              className={`flex items-center gap-2 px-3 cursor-pointer font-medium transition-all duration-300 transform text-gray-500 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg
              ${isScrolled ? "py-2 text-sm" : "py-3 text-base"}`}
            >
              <LogOut size={18} />
              <span className={`${isScrolled ? 'hidden xl:inline' : 'inline'}`}>
                Logout
              </span>
            </button>
          </div>

          {/* MOBILE VIEW - Visible only on mobile (below lg) */}
          <div className="flex lg:hidden justify-between items-center">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Breadcrumbs - Only show when menu is closed */}
          {!isMobileMenuOpen && (
            <div className="flex lg:hidden mt-3 px-1">
              <div className="flex items-center space-x-1 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    {index === 0 && <Home size={14} className="mr-1" />}
                    <span
                      className={`${
                        index === breadcrumbs.length - 1
                          ? 'text-blue-500 font-medium'
                          : 'hover:text-gray-700 cursor-pointer'
                      }`}
                      onClick={() => index !== breadcrumbs.length - 1 && router.push(crumb.path)}
                    >
                      {crumb.name}
                    </span>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight size={14} className="mx-1 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <div
        className={`mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 py-6">
            <nav className="px-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                    activeLink === link.name
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`${activeLink === link.name ? 'text-blue-500' : 'text-gray-500'}`}>
                    {link.icon}
                  </div>
                  <span className="font-medium">{link.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Footer - Logout */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;