"use client";
import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { PencilSquareIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NoteItem {
  _id: string;
  title: string;
  content: string;
}

function NotesPage() {
  const [notes, setNotes] = React.useState<NoteItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [query, setQuery] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [editingNote, setEditingNote] = React.useState<NoteItem | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState<boolean>(false);
  const [viewNote, setViewNote] = React.useState<NoteItem | null>(null);
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");

  const filteredNotes = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notes, query]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Notes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (_) {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotes();
  }, []);

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setIsModalOpen(true);
  };

  const openEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalOpen(true);
  };

  const openViewModal = (note: NoteItem) => {
    setViewNote(note);
    setIsViewOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = { title: title.trim(), content: content.trim(), user: localStorage.getItem("token")};
    const op = editingNote ? "Updating" : "Creating";
    const promise = editingNote
      ? fetch(`/api/Notes/${editingNote._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : fetch(`/api/Notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    toast.promise(promise, { loading: `${op} note...`, success: `Note ${editingNote ? "updated" : "created"}!`, error: `Failed to ${editingNote ? "update" : "create"} note` });

    try {
      const res = await promise;
      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (_) { }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    const promise = fetch(`/api/Notes/${id}`, { method: "DELETE" });
    toast.promise(promise, { loading: "Deleting note...", success: "Note deleted", error: "Failed to delete note" });
    try {
      const res = await promise;
      if (!res.ok) throw new Error();
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (_) { }
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-screen px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Notes</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage your notes efficiently.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={openCreateModal}
            aria-label="Create new note"
          >
            <PlusIcon className="h-5 w-5" /> New Note
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
              aria-label="Search notes"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-5 rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading notes…</div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No notes found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Content</th>
                    <th scope="col" className="px-4 py-3" aria-hidden />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 align-top text-sm font-medium text-gray-900 max-w-xs">
                        <span className="line-clamp-2">{note.title}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-gray-700">
                        <p className="line-clamp-2 whitespace-pre-wrap">{note.content}</p>
                      </td>
                      <td className="px-4 py-3 w-36 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openViewModal(note)}
                            className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`View note ${note.title}`}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(note)}
                            className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Edit note ${note.title}`}
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="rounded-md border border-transparent bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            aria-label={`Delete note ${note.title}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingNote ? "Edit Note" : "New Note"}</h2>
              <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => setIsModalOpen(false)} aria-label="Close modal"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="note-title" className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Note title"
                />
              </div>
              <div>
                <label htmlFor="note-content" className="mb-1 block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Write your note..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">Cancel</button>
              <button onClick={handleSave} className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && viewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={() => setIsViewOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="view-note-title" className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="view-note-title" className="text-lg font-semibold text-gray-900 truncate pr-4">{viewNote.title}</h2>
              <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => setIsViewOpen(false)} aria-label="Close view modal"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="mt-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">{viewNote.content}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsViewOpen(false)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesPage;
