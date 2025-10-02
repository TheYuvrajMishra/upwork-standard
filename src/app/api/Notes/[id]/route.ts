import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Notes from '@/app/models/Notes';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectDB();
    try {
        const body = await request.json();
        const updated = await Notes.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, note: updated }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Failed to update note' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectDB();
    try {
        const deleted = await Notes.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
    }
}


