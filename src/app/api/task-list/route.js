import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
// Corrected: Import 'Task' (singular, capitalized) from the 'Task' file.
import Task from "@/app/models/Task";

export async function GET() {
  try {
    await dbConnect();
    // Use the correct model name 'Task' to find the documents
    const tasks = await Task.find({}).populate("assignedTo", "name email"); // .populate() is added to fetch user details

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (err) {
    console.error("TASKS_FETCH_ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error while fetching tasks." },
      { status: 500 }
    );
  }
}
