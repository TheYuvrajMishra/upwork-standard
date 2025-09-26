// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import User from '@/app/models/User'; // Adjust path if needed
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // Get the request body
    const { name, email, password } = await request.json();

    // Connect to the database
    await dbConnect();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please fill all fields.' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, message: 'User created successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { success: false, message: 'Server error.' },
      { status: 500 }
    );
  }
}

export async function GET(){
  try{
    await dbConnect();
    const user = await User.find();
    return NextResponse.json({user}, {status: 200});
  }
  catch(error){
    return NextResponse.json(
      { success: false, message: 'Server error.' },
      { status: 500 }
    );
  }
}