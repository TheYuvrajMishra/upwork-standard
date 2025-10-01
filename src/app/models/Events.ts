// models/Event.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export type EventType = 'Meeting' | 'Deadline' | 'Team Building' | 'Project Timeline' | 'Personal';

export interface IEvent extends Document {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: EventType;
  color: string; // New field for custom event color
}

const EventSchema: Schema<IEvent> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the event.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  start: {
    type: Date,
    required: [true, 'Please provide a start date.'],
  },
  end: {
    type: Date,
    required: [true, 'Please provide an end date.'],
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['Meeting', 'Deadline', 'Team Building', 'Project Timeline', 'Personal'],
    required: true,
  },
  color: { // Add the color schema definition
    type: String,
    required: true,
  }
}, { timestamps: true });

export default (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);