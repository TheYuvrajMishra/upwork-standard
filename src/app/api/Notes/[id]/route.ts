import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Notes from '@/app/models/Notes';

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

// Helper function to verify note ownership
const verifyNoteOwnership = async (noteId: string, userToken: string): Promise<boolean> => {
    try {
        const note = await Notes.findById(noteId);
        return !!(note && (note as any).user === userToken);
    } catch (error) {
        return false;
    }
};

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectDB();
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('bearer ', '') || authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
        }

        // Verify note ownership
        const isOwner = await verifyNoteOwnership(id, token);
        if (!isOwner) {
            return NextResponse.json({ success: false, error: 'Unauthorized: You can only edit your own notes' }, { status: 403 });
        }

        const body = await request.json();
        const updated = await Notes.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, note: updated }, { status: 200 });
    } catch (err) {
        console.error('Error updating note:', err);
        return NextResponse.json({ success: false, error: 'Failed to update note' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectDB();
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('bearer ', '') || authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
        }

        // Verify note ownership
        const isOwner = await verifyNoteOwnership(id, token);
        if (!isOwner) {
            return NextResponse.json({ success: false, error: 'Unauthorized: You can only delete your own notes' }, { status: 403 });
        }

        const deleted = await Notes.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('Error deleting note:', err);
        return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
    }
}


