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
import { CalendarToolbar } from '@/app/components/CalendarToolbar';
import { ClockIcon, PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
// FIXED: Explicitly type DnDCalendar with CalendarEvent for correct prop types
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

// --- Custom Agenda Event Component (Subtle, Professional Card) ---
const CustomAgendaEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  const eventColor = event.color || '#3174ad';

  return (
    <div className="my-2 w-full rounded-lg border border-gray-200 bg-white/90 p-4 transition-colors hover:border-gray-300">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Title + Description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: eventColor }}
            />
            <p className="truncate text-sm font-semibold text-gray-900">{event.title}</p>
          </div>
          {event.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">{event.description}</p>
          )}
        </div>

        {/* Right: Time + Type */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>
              {event.allDay ? 'All day' : `${format(event.start!, 'p')} – ${format(event.end!, 'p')}`}
            </span>
          </div>
          <span
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-gray-700"
            style={{ borderColor: `${eventColor}33` }}
          >
            <span
              className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: eventColor }}
            />
            {event.type}
          </span>
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
  const [showFilters, setShowFilters] = useState(false);

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

  const handleCreateNew = () => {
    const start = new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
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

  const onEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'] = async ({ event, start, end }: any) => {
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

  const onEventResize: withDragAndDropProps<CalendarEvent>['onEventResize'] = async ({ event, start, end }: any) => {
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
      <div className="min-h-screen font-sans  flex">
        {/* Sidebar (md+) */}
        <aside className="hidden md:block w-52 shrink-0 border-r border-gray-200 bg-white">
          <div className="sticky top-0 p-4">
            <h2 className="text-base font-semibold text-gray-900">Filters</h2>
            <p className="mt-1 text-xs text-gray-500">Toggle event types</p>
            <div className="mt-3 space-y-1.5">
              {Object.entries(EventColorMap).map(([type, color]) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filter-${type}`}
                    checked={activeFilters.has(type as EventType)}
                    onChange={() => toggleFilter(type as EventType)}
                    className="h-3.5 w-3.5 rounded border-gray-300"
                    style={{ accentColor: color }}
                    aria-checked={activeFilters.has(type as EventType)}
                  />
                  <label htmlFor={`filter-${type}`} className="ml-2 text-xs text-gray-700 flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-gray-50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pt-4 sm:pt-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Calendar</h1>
                <p className="mt-1 text-sm text-gray-600">Plan, track, and review your events.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(prev => !prev)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden"
                  aria-pressed={showFilters}
                  aria-label="Toggle filters"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
                  Filters
                </button>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="mt-4 md:hidden rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {Object.entries(EventColorMap).map(([type, color]) => (
                    <label key={type} htmlFor={`m-filter-${type}`} className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        id={`m-filter-${type}`}
                        type="checkbox"
                        checked={activeFilters.has(type as EventType)}
                        onChange={() => toggleFilter(type as EventType)}
                        className="h-3.5 w-3.5 rounded border-gray-300"
                        style={{ accentColor: color }}
                        aria-checked={activeFilters.has(type as EventType)}
                      />
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-lg border border-gray-200 bg-white shadow-sm">
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
                style={{ height: '78vh' }}
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: CalendarToolbar,
                  agenda: {
                    event: CustomAgendaEvent,
                  },
                }}
              />
            </div>
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

