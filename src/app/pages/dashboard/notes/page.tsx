"use client";
import React, { use } from "react";

function page() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [notes, setNotes] = React.useState<any[]>([]);

  const handleSubmit = async () => {
    console.log(title, content);
    const user = localStorage.getItem("token");
    const res = await fetch("/api/Notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content, user }),
    });
    const data = await res.json();
    console.log(data);
  };
  React.useEffect(() => {
    const fetchdata = async () => {
      const res = await fetch("/api/Notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setNotes(data.notes);
    };
    fetchdata();
  }, []);
  return (
    <div>
      <div>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
        <input
          type="text"
          onChange={(e) => setContent(e.target.value)}
          placeholder="content"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {notes.length > 0 ? (
        <table className="table-auto w-screen border-collapse border border-black/20">
          <thead className="bg-black/10">
            <tr>
              <th>Title</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index}>
                <td>{note.title}</td>
                <td>{note.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No notes available</p>
      )}
    </div>
  );
}

export default page;
