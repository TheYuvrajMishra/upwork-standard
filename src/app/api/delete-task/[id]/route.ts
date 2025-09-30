// src/app/api/delete-task/[id]/route.ts

import Task from "@/app/models/Task";
import dbConnect from "@/lib/dbConnect";
import {NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";

// The function signature is changed here
export async function DELETE(
  context: { params: { id: string } },
  NextRequest: NextRequest
) {
  // 1. Connect to the database
  await dbConnect();

  // Destructure id from the context object
  const { id } = context.params;

  // 2. Validate the provided ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Task ID format", success: false },
      { status: 400 }
    );
  }

  try {
    // 3. Find the task by its ID and delete it
    const deletedTask = await Task.findByIdAndDelete(id);

    // 4. Handle case where the task is not found
    if (!deletedTask) {
      return NextResponse.json(
        { message: "Task not found", success: false },
        { status: 404 }
      );
    }

    // 5. Return a success response
    return NextResponse.json(
      { message: "Task deleted successfully", success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting task:", error);
    // 6. Handle any server errors
    return NextResponse.json(
      { message: "An error occurred while deleting the task", success: false },
      { status: 500 }
    );
  }
}