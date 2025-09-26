import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

// NOTE: In a real-world app, you would add authentication middleware here
// to verify a JWT and protect this route. For now, this route is public
// but safely configured to never expose password data.

export async function GET() {
  try {
    await dbConnect();

    // Fetch all users from the database, but use .select('-password')
    // to explicitly EXCLUDE the password field from the result.
    // This is a critical security measure.
    const users = await User.find({}).select('-password');

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('USER_FETCH_ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching users.' },
      { status: 500 }
    );
  }
}
