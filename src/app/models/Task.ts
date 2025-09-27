// models/Task.js
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title.'],
        trim: true, // Good practice to remove whitespace
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Provides set options for priority
        default: 'Medium',
        required: [true, 'Please specify the priority.'],
    },
    assignedTo: [{ // This now accepts an array of User ObjectIds
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'], // Provides set options for status
        default: 'To Do',
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);