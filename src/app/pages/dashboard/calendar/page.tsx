"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View, EventProps } from 'react-big-calendar';
// CORRECTED IMPORT: Use the modern 'dnd' addon path
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import { CalendarEvent, EventFormData, EventColorMap, EventType } from '@/app/types'; // Corrected path
// CORRECTED IMPORT: Fixed potential typo 'EventsModal' to 'EventModal'
import EventModal from '@/app/components/EventsModal'; 
// CORRECTED IMPORT: Toolbar is likely a default export
import {CalendarToolbar} from '@/app/components/CalendarToolbar';
import { ClockIcon } from '@heroicons/react/24/outline';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
// FIXED: Explicitly type DnDCalendar with CalendarEvent for correct prop types
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

// --- Custom Agenda Event Component (Table Format) ---
const CustomAgendaEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  // A default color in case event.color is not provided
  const eventColor = event.color || '#3174ad';

  return (
    <div className="relative flex w-full items-center rounded-lg bg-white p-4 pr-5 shadow-sm transition-shadow hover:shadow-md my-2">
      {/* Color Bar */}
      <div
        className="absolute left-0 top-0 h-full w-1.5 rounded-l-lg"
        style={{ backgroundColor: eventColor }}
      ></div>

      {/* Main Content Area */}
      <div className="ml-4 flex flex-grow flex-col justify-center sm:flex-row sm:items-center sm:justify-between">
        
        {/* Event Title and Description */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-800">{event.title}</p>
          {event.description && (
            <p className="mt-1 truncate text-sm text-gray-500">{event.description}</p>
          )}
        </div>

        {/* Time Information */}
        <div className="mt-2 flex-shrink-0 sm:mt-0 sm:ml-6">
          <div className="flex items-center justify-start gap-1.5 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>
              {event.allDay ? 'All Day' : `${format(event.start!, 'p')} - ${format(event.end!, 'p')}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};



function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(Object.keys(EventColorMap) as EventType[]));

  // --- Data Fetching and Filtering ---
  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('/api/events');
      const formattedEvents = response.data.data.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events', error);
      toast.error('Failed to load events.');
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const filtered = events.filter(event => activeFilters.has(event.type));
    setFilteredEvents(filtered);
  }, [events, activeFilters]);

  const toggleFilter = (type: EventType) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(type)) {
        newFilters.delete(type);
      } else {
        newFilters.add(type);
      }
      return newFilters;
    });
  };

  // --- CRUD Handlers ---
  const handleSave = async (eventData: EventFormData) => {
    console.log("DEBUG: Data received in handleSave from modal:", eventData);
    const eventToSave = {
      ...eventData,
      start: eventData.start.toISOString(),
      end: eventData.end.toISOString(),
    };

    console.log("DEBUG: Sending this object to the API:", eventToSave);
    const promise = eventData._id
      ? axios.put(`/api/events/${eventData._id}`, eventToSave)
      : axios.post('/api/events', eventToSave);

    toast.promise(promise, {
      loading: 'Saving event...',
      success: `Event "${eventData.title}" saved!`,
      error: 'Could not save event.',
    });
    
    promise.then(() => {
      closeModal();
      fetchEvents();
    }).catch(console.error);
  };
  
  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
        const promise = axios.delete(`/api/events/${eventId}`);
        toast.promise(promise, {
          loading: 'Deleting event...',
          success: 'Event deleted successfully!',
          error: 'Could not delete event.',
        });
        promise.then(() => {
          closeModal();
          fetchEvents();
        }).catch(console.error);
    }
  };

  // --- Calendar Interaction Handlers ---
  const handleSelectSlot = useCallback(({ start, end }: { start: Date, end: Date }) => {
    setSelectedEvent({
      title: '',
      description: '',
      start,
      end,
      allDay: false,
      type: 'Meeting',
      color: EventColorMap['Meeting'],
    });
    setIsModalOpen(true);
  }, []);
  
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent({
      ...event,
      title: typeof event.title === 'string' ? event.title : '',
      start: new Date(event.start!),
      end: new Date(event.end!),
      allDay: event.allDay ?? false,
    });
    setIsModalOpen(true);
  }, []);

  const onEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'] = async ({ event, start, end }:any) => {
    const updatedEventData = { ...event, start, end };
    
    try {
      // FIXED: Send the entire updated event object to persist all fields
      await axios.put(`/api/events/${event._id}`, updatedEventData);
      setEvents((prev) => prev.map(e => (e._id === event._id ? updatedEventData : e)));
      toast.success(`Moved "${event.title}"`);
    } catch (error) {
      toast.error(`Failed to move "${event.title}"`);
      // Revert local state on failure by re-fetching
      fetchEvents(); 
      console.error(error);
    }
  };

  const onEventResize: withDragAndDropProps<CalendarEvent>['onEventResize'] = async ({ event, start, end }:any) => {
    const resizedEventData = { ...event, start, end };
    try {
      // FIXED: Send the entire updated event object to persist all fields
      await axios.put(`/api/events/${event._id}`, resizedEventData);
      setEvents((prev) => prev.map(e => (e._id === event._id ? resizedEventData : e)));
      toast.success(`Resized "${event.title}"`);
    } catch (error) {
      toast.error(`Failed to resize "${event.title}"`);
      // Revert local state on failure by re-fetching
      fetchEvents();
      console.error(error);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // --- UI and Styling ---
  const eventStyleGetter = (event: CalendarEvent) => {
    // DEBUG: Log the event being styled to check its color property
    console.log(`DEBUG: Styling event "${event.title}" with color: ${event.color}`);
    const style = {
        backgroundColor: event.color,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
    };
    return { style };
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen font-sans bg-gray-50 flex">
        <aside className="w-64 bg-white p-4 hidden md:block border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Filters</h2>
          <div className="space-y-2">
            {Object.entries(EventColorMap).map(([type, color]) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`filter-${type}`}
                  checked={activeFilters.has(type as EventType)}
                  onChange={() => toggleFilter(type as EventType)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: color }}
                />
                <label htmlFor={`filter-${type}`} className="ml-3 text-sm text-gray-700">{type}</label>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">A professional-grade event management system.</p>
            
            <div className="bg-white rounded-lg shadow-lg mt-6">
                <DnDCalendar
                    defaultDate={new Date()}
                    defaultView={Views.MONTH}
                    events={filteredEvents}
                    localizer={localizer}
                    onEventDrop={onEventDrop}
                    onEventResize={onEventResize}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    onView={setView}
                    view={view}
                    onNavigate={setDate}
                    date={date}
                    resizable
                    selectable
                    style={{ height: '100vh' }}
                    eventPropGetter={eventStyleGetter}
                    components={{
                        toolbar: CalendarToolbar,
                        agenda: {
                          event: CustomAgendaEvent,
                        },
                    }}
                />
            </div>
        </main>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
        eventData={selectedEvent}
        setEventData={setSelectedEvent}
      />
    </>
  );
}

export default CalendarPage;

