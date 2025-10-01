import Link from 'next/link';
import { Book, Calendar, ClipboardCheck, BarChart3 } from 'lucide-react'; // Using lucide-react for icons, a popular choice.

// Array to hold the navigation links for easy mapping
const dashboardLinks = [
  {
    href: '/dashboard/calendar',
    title: 'Calendar',
    description: 'View and manage your team and personal schedule.',
    icon: <Calendar className="h-8 w-8 text-blue-500" />,
  },
  {
    href: '/dashboard/notes',
    title: 'Notes',
    description: 'Create, edit, and organize your personal and shared notes.',
    icon: <Book className="h-8 w-8 text-yellow-500" />,
  },
  {
    href: '/dashboard/staff-reports',
    title: 'Staff Reports',
    description: 'Access analytics and performance reports for your staff.',
    icon: <BarChart3 className="h-8 w-8 text-green-500" />,
  },
  {
    href: '/dashboard/tasks',
    title: 'Tasks',
    description: 'Keep track of your to-do items and assigned tasks.',
    icon: <ClipboardCheck className="h-8 w-8 text-red-500" />,
  },
];

export default function DashboardHomePage() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Dashboard Home
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Welcome back! Select a section below to get started.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
            >
              <div className="flex items-center gap-4">
                {link.icon}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.title}
                  </h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}