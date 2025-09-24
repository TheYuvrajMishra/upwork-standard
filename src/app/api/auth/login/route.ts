// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import User from '@/app/models/User';       // Adjust path if needed
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // 1. Get the request body
    const { email, password } = await request.json();

    // 2. Connect to the database
    await dbConnect();

    // 3. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password.' },
        { status: 400 }
      );
    }

    // 4. Find user and explicitly include the password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // 5. Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // 6. Check for JWT Secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in .env.local');
        return NextResponse.json(
            { success: false, message: 'Server configuration error.' },
            { status: 500 }
        );
    }

    // 7. Create token payload and sign the token
    const payload = { id: user._id, name: user.name };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // 8. Return the token
    return NextResponse.json({ success: true, token }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error); // Good practice to log the actual error
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}