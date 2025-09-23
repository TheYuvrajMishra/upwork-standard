"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

type Stat = {
  id: number;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
};

type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
};

type Activity = {
  id: number;
  type: string;
  message: string;
  timestamp: string;
};

type DashboardData = {
  stats: Stat[];
  staff: StaffMember[];
  tasks: Task[];
  recentActivity: Activity[];
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    stats: [],
    staff: [],
    tasks: [],
    recentActivity: []
  });

  // Simulate API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data structure - replace with actual API calls
      setData({
        stats: [
          { id: 1, label: 'Total Employees', value: 247, change: 12, trend: 'up' },
          { id: 2, label: 'Active Projects', value: 18, change: -2, trend: 'down' },
          { id: 3, label: 'Tasks Completed', value: 1284, change: 56, trend: 'up' },
          { id: 4, label: 'Revenue (M)', value: 24.8, change: 2.1, trend: 'up' }
        ],
        staff: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `Employee ${i + 1}`,
          email: `employee${i + 1}@company.com`,
          role: ['Senior Developer', 'Product Manager', 'Designer', 'Marketing Specialist'][i % 4],
          department: ['Engineering', 'Product', 'Design', 'Marketing'][i % 4],
          status: ['active', 'inactive', 'away'][Math.floor(Math.random() * 3)],
          joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
        })),
        tasks: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          title: `Task ${i + 1}`,
          description: `Description for task ${i + 1}`,
          assignee: `Employee ${Math.floor(Math.random() * 50) + 1}`,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: ['todo', 'in-progress', 'review', 'completed'][Math.floor(Math.random() * 4)],
          dueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        })),
        recentActivity: Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          type: 'task_completed',
          message: `Task completed by Employee ${Math.floor(Math.random() * 50) + 1}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
        }))
      });
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter functions
  const filteredStaff = data.staff.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = data.tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ stat }:any) => (
    <div className="bg-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
        </div>
        <div className={`flex items-center text-sm ${
          stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {stat.trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          {Math.abs(stat.change)}
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map(stat => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Recent Tasks</h3>
              <button className="text-sm text-gray-600 hover:text-gray-900">View all</button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {data.tasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span>{task.assignee}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        task.priority === 'high' ? 'bg-red-50 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    task.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                    task.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                    task.status === 'review' ? 'bg-purple-50 text-purple-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Activity Feed</h3>
          </div>
          <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
            {data.recentActivity.slice(0, 8).map(activity => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const StaffTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStaff.slice(0, 20).map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{member.role}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{member.department}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      member.status === 'away' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{member.joinDate}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TasksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTasks.slice(0, 20).map(task => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{task.assignee}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'high' ? 'bg-red-50 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      task.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                      task.status === 'review' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{task.dueDate}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'staff', label: 'Staff' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'projects', label: 'Projects' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="border-b border-gray-100 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Projects</h3>
              <p className="text-gray-500">Project management features coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;