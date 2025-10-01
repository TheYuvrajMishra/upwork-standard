// app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event, { IEvent } from '@/app/models/Events';

// GET all events
export async function GET() {
  await dbConnect();
  try {
    const events: IEvent[] = await Event.find({});
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

// POST a new event
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const event: IEvent = await Event.create(body);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}