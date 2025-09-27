import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

export async function GET() {
  try {
    await dbConnect();
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
