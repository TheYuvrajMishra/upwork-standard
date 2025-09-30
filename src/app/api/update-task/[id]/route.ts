import Task from "@/app/models/Task";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1. Connect to the database
  await dbConnect();

  const { id } = await params;

  // 2. Validate the provided ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Task ID format", success: false },
      { status: 400 }
    );
  }

  try {
    // 3. Get the updated data from the request body
    const body = await request.json();
    const { title, description, status, priority, assignedTo } = body;

    // Optional: Add server-side validation for the body
    if (!title || !status || !priority) {
      return NextResponse.json(
        { message: "Missing required fields: title, status, and priority are required.", success: false },
        { status: 400 }
      );
    }
    
    // 4. Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, priority, assignedTo },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    // 5. Handle case where the task is not found
    if (!updatedTask) {
      return NextResponse.json(
        { message: "Task not found", success: false },
        { status: 404 }
      );
    }

    // 6. Return a success response with the updated task
    return NextResponse.json(
      {
        message: "Task updated successfully",
        success: true,
        data: updatedTask,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the task", success: false },
      { status: 500 }
    );
  }
}