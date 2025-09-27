"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User,
  X,
  ChevronDown,
  Filter
} from "lucide-react";

// Define a more complete interface for a Task to match your API data
interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Completed";
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  }[];
}

// Helper function to get initials from a name
const getInitials = (name: string = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Main page component
function Page() {
  const [addTask, setAddTask] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStaffPanel, setShowStaffPanel] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch staff data.");
        const data = await res.json();
        setStaff(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
    fetchTasks();
  }, [router]);

  // Move fetchTasks to be accessible in the component scope
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const res = await fetch("/api/task-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks.");
      const data = await res.json();
      setTasks(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddTask = () => setAddTask(true);
  const handleCloseModal = () => setAddTask(false);

  const statusColors: { [key: string]: { bg: string; text: string; icon: any } } = {
    "To Do": { bg: "bg-gray-100", text: "text-gray-700", icon: Clock },
    "In Progress": { bg: "bg-blue-100", text: "text-blue-700", icon: AlertCircle },
    "Completed": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  };

  const priorityColors: { [key: string]: { pill: string; text: string } } = {
    High: { pill: "bg-red-100 border border-red-200", text: "text-red-700" },
    Medium: { pill: "bg-yellow-100 border border-yellow-200", text: "text-yellow-700" },
    Low: { pill: "bg-green-100 border border-green-200", text: "text-green-700" },
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "Completed").length;
    const inProgress = tasks.filter(task => task.status === "In Progress").length;
    const toDo = tasks.filter(task => task.status === "To Do").length;
    return { total, completed, inProgress, toDo };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen font-sans">
      {/* Mobile Staff Panel Overlay */}
      {showStaffPanel && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowStaffPanel(false)} />
      )}

      <main className="pt-0 lg:pt-0 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header Section */}
        <div className="max-w-screen mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Tasks Overview</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track all your team tasks</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Mobile Staff Button */}
              <button
                onClick={() => setShowStaffPanel(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Users size={18} />
                <span>View Staff ({staff.length})</span>
              </button>

              <button
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-gray-600">{stats.toDo}</div>
              <div className="text-sm text-gray-600">To Do</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading tasks...</span>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No tasks found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {tasks.length === 0 ? "Create your first task to get started" : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const StatusIcon = statusColors[task.status]?.icon || Clock;
                  return (
                    <div key={task._id} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 sm:line-clamp-3">{task.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusIcon size={16} className={statusColors[task.status]?.text} />
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[task.status]?.bg} ${statusColors[task.status]?.text}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-100 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned To</span>
                          </div>
                          <div className="flex -space-x-2">
                            {task.assignedTo.slice(0, 3).map((member) => (
                              <div 
                                key={member._id} 
                                title={member.name} 
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold ring-2 ring-white"
                              >
                                {getInitials(member.name)}
                              </div>
                            ))}
                            {task.assignedTo.length > 3 && (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold ring-2 ring-white">
                                +{task.assignedTo.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${priorityColors[task.priority]?.pill} ${priorityColors[task.priority]?.text}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Staff Panel */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Staff Members
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 max-h-[70vh] overflow-auto">
                  {staff.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No staff members found.</p>
                  ) : (
                    <ul className="space-y-3">
                      {staff.map((member) => (
                        <li key={member._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                            {getInitials(member.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Staff Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        showStaffPanel ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} />
              Team Members
            </h2>
            <button
              onClick={() => setShowStaffPanel(false)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No staff members found.</p>
            ) : (
              <ul className="space-y-3">
                {staff.map((member) => (
                  <li key={member._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Pass the staff data as a prop here */}
      <AddTask 
        isOpen={addTask} 
        onClose={handleCloseModal} 
        staff={staff} 
        onTaskAdded={fetchTasks} 
      />
    </div>
  );
}

// 1. Define a proper interface for props for type safety
interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    _id: string;
    name: string;
    email: string;
  }[];
  onTaskAdded: () => void; // Function to refresh data in the parent component
}

function AddTask({ isOpen, onClose, staff, onTaskAdded }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("To Do");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Function to reset all form fields to their initial state
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setAssignedTo("");
    setStatus("To Do");
    setError(null);
  };

  const handleSave = async () => {
    // Better Validation
    if (!title.trim()) {
      setError("Title is a required field.");
      return;
    }
    if (!assignedTo) {
      setError("Please assign the task to a staff member.");
      return;
    }
    
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/add-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, assignedTo, status })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong.');
      }

      // Success!
      resetForm();   // 3. Reset the form on success
      onTaskAdded(); // 4. Tell the parent component to refresh its data
      onClose();     // 5. Close the modal

    } catch (err: any) {
      setError(err.message);
      console.error("Failed to save task:", err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
      resetForm(); // 6. Reset the form when the user cancels
      onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To *
              </label>
              <select
                value={assignedTo}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select a team member</option>
                {staff.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} - {member.email}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              disabled={isSaving}
            >
              {isSaving ? 'Creating Task...' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;