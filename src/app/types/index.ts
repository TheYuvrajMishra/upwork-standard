// types/index.ts
import { Event as BigCalendarEvent } from 'react-big-calendar';

export type EventType = 'Meeting' | 'Deadline' | 'Team Building' | 'Project Timeline' | 'Personal';

export const EventColorMap: Record<EventType, string> = {
  'Meeting': '#3174ad', // Blue
  'Deadline': '#d9534f', // Red
  'Team Building': '#5cb85c', // Green
  'Project Timeline': '#f0ad4e', // Orange
  'Personal': '#5bc0de', // Cyan
};

export interface CalendarEvent extends BigCalendarEvent {
  _id?: string;
  description?: string;
  type: EventType;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFormData {
  _id?: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: EventType;
  color: string;
}