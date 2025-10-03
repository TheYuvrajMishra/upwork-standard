import { NextRequest, NextResponse } from "next/server";
import Notes from "@/app/models/Notes";
import connectDB from "@/lib/dbConnect";

// Utility function to decode JWT and extract user
const decodeJWT = (token: string | null): string | null => {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = atob(paddedPayload);
        const parsedPayload = JSON.parse(decodedPayload);

        return parsedPayload.username || parsedPayload.name || parsedPayload.email || null;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export async function GET(request: NextRequest) {
    await connectDB();
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('bearer ', '') || authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
        }

        // Decode JWT to get username
        const username = decodeJWT(token);
        if (!username) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Filter notes by the authenticated user
        const notes = await Notes.find({ user: token }); // Store the full token for consistency
        return NextResponse.json({ notes }, { status: 200 });
    } catch (err) {
        console.error('Error fetching notes:', err);
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('bearer ', '') || authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
        }

        // Decode JWT to get username
        const username = decodeJWT(token);
        if (!username) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const { title, content } = await request.json();
        const newNote = new Notes({ title, content, user: token }); // Store the full token
        await newNote.save();
        return NextResponse.json({ message: "Note created successfully", note: newNote }, { status: 201 });
    } catch (err) {
        console.error('Error creating note:', err);
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}