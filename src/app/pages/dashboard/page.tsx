import Link from 'next/link';
import { Book, Calendar, ClipboardCheck, BarChart3 } from 'lucide-react';

/**
 * An array of objects defining the navigation links for the dashboard.
 * Each object contains the path, title, description, icon component,
 * and specific styling classes for the icon's container and color.
 * This approach makes the component modular and easy to update.
 */
const dashboardLinks = [
  {
    href: '/pages/dashboard/tasks',
    title: 'Tasks',
    description: 'Keep track of your to-do items and projects.',
    icon: <ClipboardCheck className="h-8 w-8 text-rose-600" />,
    iconContainerClass: 'bg-rose-100',
  },
  {
    href: '/pages/dashboard/calendar',
    title: 'Calendar',
    description: 'View your team and personal schedule.',
    icon: <Calendar className="h-8 w-8 text-sky-600" />,
    iconContainerClass: 'bg-sky-100',
  },
  {
    href: '/pages/dashboard/notes',
    title: 'Notes',
    description: 'Create, edit, and organize your ideas.',
    icon: <Book className="h-8 w-8 text-amber-600" />,
    iconContainerClass: 'bg-amber-100',
  },
  {
    href: '/pages/dashboard/staff-reports',
    title: 'Staff Reports',
    description: 'Access analytics and performance data.',
    icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
    iconContainerClass: 'bg-emerald-100',
  },
];

export default function DashboardHomePage() {
  return (
    // Main container with a soft, light background for an airy feel
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header with centered text for a more formal and welcoming presentation */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Welcome to Your Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need, right at your fingertips. Select a module below to get started.
          </p>
        </div>

        {/* Responsive grid for the navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-200 hover:border-blue-500"
            >
              {/* Top section of the card */}
              <div>
                {/* Icon with a colored background for better visual hierarchy */}
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-5 ${link.iconContainerClass}`}
                >
                  {link.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  {link.title}
                </h2>
                <p className="mt-2 text-slate-500 text-base">
                  {link.description}
                </p>
              </div>
              
              {/* Bottom section of the card with a call-to-action that appears on hover */}
              <div className="mt-6">
                <span className="font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Go to {link.title} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}