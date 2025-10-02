import { NextResponse } from "next/server";
import Notes from "@/app/models/Notes";
import connectDB from "@/lib/dbConnect";

export async function GET() {
    await connectDB();
    try {
        const notes = await Notes.find({});
        return NextResponse.json({notes}, {status: 200});
    }catch(err){
        return NextResponse.json({error: "Failed to fetch notes"}, {status: 500});
    }
}

export async function POST(request: Request) {
    await connectDB();
    try{
        const {title, content, user}= await request.json();
        const newNote = new Notes({title, content, user});
        await newNote.save();
        return NextResponse.json({message: "Note created successfully", note: newNote}, {status: 201});
    }catch(err){
        return NextResponse.json({error: "Failed to create note"}, {status: 500});
    }
}