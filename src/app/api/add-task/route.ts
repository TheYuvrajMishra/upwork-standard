import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose'; // <-- Required for the type guard
import dbConnect from '@/lib/dbConnect';
import Task from '@/app/models/Task';
import User from '@/app/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, description, priority, assignedTo, status } = body;

    // --- Input Validation ---
    if (!title || !description || !assignedTo) {
      return NextResponse.json(
        { success: false, message: 'Title, description, and assignedTo are required fields.' },
        { status: 400 }
      );
    }

    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: 'The user assigned to this task does not exist.' },
        { status: 404 } // Not Found
      );
    }
    
    // --- Task Creation ---
    const newTask = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      status,
    });

    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201 } // 201 Created
    );

  } catch (error: unknown) { // Use 'unknown' for type safety
    // Handle Mongoose validation errors specifically
    if (error instanceof mongoose.Error.ValidationError) {
      // The 'any' on 'err' is no longer needed due to type inference
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 } // Bad Request
      );
    }

    // Handle other potential errors
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}





export async function GET() {
  try {
    await dbConnect();
    // Use the correct model name 'Task' to find the documents
    const tasks = await Task.find({}).populate('assignedTo', 'name email'); // .populate() is added to fetch user details

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (err) {
    console.error("TASKS_FETCH_ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error while fetching tasks." },
      { status: 500 }
    );
  }
}