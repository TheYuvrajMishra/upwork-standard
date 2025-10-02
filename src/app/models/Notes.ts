import mongoose, { Schema } from "mongoose";

export interface INote extends mongoose.Document {
    title: string;
    content: string;
}
const NotesSchema: Schema = new mongoose.Schema({
    user: {
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });


export default mongoose.model<INote>("Notes", NotesSchema);

