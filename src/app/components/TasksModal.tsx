import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileText, 
  Tag, 
  Calendar,
  Trash2 // Added for delete functionality
} from 'lucide-react';

// Task interface - adjust this to match your existing Task interface
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

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void; // Callback to refresh tasks in parent component
  onTaskDeleted: () => void; // Callback for when a task is deleted
}

// Helper function to get initials from a name
const getInitials = (name: string = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

function TaskDetailsModal({ task, isOpen, onClose, onTaskUpdated, onTaskDeleted }: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status
      });
      // Reset editing state when a new task is selected
      setIsEditing(false);
      setIsConfirmingDelete(false);
      setError(null);
    }
  }, [task]);

  if (!isOpen || !task) return null;

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

  const StatusIcon = statusColors[task.status]?.icon || Clock;

  const handleSave = async () => {
    if (!editedTask.title?.trim()) {
      setError("Title is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`/api/update-task/${task._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedTask)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update task');
      }

      setIsEditing(false);
      onTaskUpdated(); // Refresh tasks in parent component
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/delete-task/${task._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete task');
        }

        onTaskDeleted(); // Notify parent to refresh
        onClose(); // Close the modal

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsDeleting(false);
        setIsConfirmingDelete(false);
    }
  }

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none pb-1"
                  placeholder="Task title"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900 pr-4">{task.title}</h2>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button onClick={() => setIsConfirmingDelete(true)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Delete task">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit task">
                    <Edit3 size={18} />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isConfirmingDelete && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <p className="font-semibold text-red-800">Are you sure you want to delete this task?</p>
                  <p className="text-sm text-red-700">This action cannot be undone.</p>
                  <div className="flex gap-3">
                      <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium" disabled={isDeleting}>
                          {isDeleting ? 'Deleting...' : 'Yes, Delete Task'}
                      </button>
                      <button onClick={() => setIsConfirmingDelete(false)} className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
                          Cancel
                      </button>
                  </div>
              </div>
          )}

          {/* Status and Priority */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <StatusIcon size={16} />
                Status
              </label>
              {isEditing ? (
                <select
                  value={editedTask.status || task.status}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${statusColors[task.status]?.bg} ${statusColors[task.status]?.text}`}>
                  <StatusIcon size={16} />
                  <span className="font-medium">{task.status}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} />
                Priority
              </label>
              {isEditing ? (
                <select
                  value={editedTask.priority || task.priority}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                <span className={`inline-block px-3 py-2 text-sm font-bold rounded-lg ${priorityColors[task.priority]?.pill} ${priorityColors[task.priority]?.text}`}>
                  {task.priority} Priority
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} />
              Description
            </label>
            {isEditing ? (
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Task description..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>
            )}
          </div>

          {/* Assigned Team Members */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Users size={16} />
              Assigned To ({task.assignedTo.length})
            </label>
            <div className="space-y-3">
              {task.assignedTo.map((member) => (
                <div key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} />
                Task ID
              </label>
              <p className="text-sm text-gray-600 font-mono">{task._id}</p>
            </div>
          </div>

          {/* Action Buttons for Editing */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
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
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;

