"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  const statusColors: { [key: string]: string } = {
    "To Do": "bg-gray-400",
    "In Progress": "bg-blue-500",
    Completed: "bg-green-500",
  };

  const priorityColors: { [key: string]: { pill: string; text: string } } = {
    High: { pill: "bg-red-100", text: "text-red-700" },
    Medium: { pill: "bg-yellow-100", text: "text-yellow-700" },
    Low: { pill: "bg-green-100", text: "text-green-700" },
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="flex gap-8 p-8">
        {/* tasks */}
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-regular text-gray-800">Tasks</h1>
            <button
              onClick={handleAddTask}
              className="bg-blue-500 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No tasks assigned yet.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${statusColors[task.status]}`}></div>
                      <span className="text-sm font-medium text-gray-600">{task.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{task.description}</p>
                  <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Assigned To</h4>
                      <div className="flex -space-x-2">
                        {task.assignedTo.map((member) => (
                          <div key={member._id} title={member.name} className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-blue-400 text-xs font-bold ring-2 ring-white">
                            {getInitials(member.name)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${priorityColors[task.priority]?.pill} ${priorityColors[task.priority]?.text}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* staff */}
        <div className="w-1/3">
          <h1 className="text-3xl font-regular text-gray-800 mb-8">Staff</h1>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 max-h-[85vh] overflow-auto">
            {staff.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No staff members found.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {staff.map((member) => (
                  <li key={member._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">{member.name}</h2>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

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
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/3 space-y-4">
        <h2 className="text-xl font-bold mb-4">Add a New Task</h2>

        {/* Form inputs remain the same */}
        <input
          type="text"
          value={title}
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
        />

        <textarea
          value={description}
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          rows={3}
        />

        <select
          value={priority}
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <select
          value={assignedTo}
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">-- Select a staff member --</option>
          {staff.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleCancel} // Use the new cancel handler
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;