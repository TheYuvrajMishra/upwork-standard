"use client";

import { Dialog, Transition, Switch } from '@headlessui/react';
import {
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EventFormData, EventType, EventColorMap } from '@/app/types'; // Adjusted path
import clsx from 'clsx';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventFormData) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  eventData: EventFormData | null;
  setEventData: React.Dispatch<React.SetStateAction<EventFormData | null>>;
}

// Helper function to format date for input[type=datetime-local]
const formatToDateTimeLocal = (date: Date): string => {
  // Subtracts the timezone offset to display the correct local time in the input
  const correctedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return correctedDate.toISOString().slice(0, 16);
};

export default function EventModal({ isOpen, onClose, onSave, onDelete, eventData, setEventData }: EventModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string>('');

  // Reset error when modal opens or data changes
  useEffect(() => {
    setError(null);
    if (eventData?.color) setCustomColor(eventData.color);
  }, [isOpen, eventData]);

  if (!eventData) return null;

  const isNewEvent = !eventData._id;

  const handleTypeChange = (type: EventType) => {
    setEventData({
      ...eventData,
      type: type,
      color: EventColorMap[type],
    });
  };

  const handleAllDayToggle = (isAllDay: boolean) => {
    if (isAllDay) {
      const startOfDay = new Date(eventData.start);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(eventData.start);
      endOfDay.setHours(23, 59, 59, 999);
      setEventData({ ...eventData, allDay: true, start: startOfDay, end: endOfDay });
    } else {
      // Revert to a sensible default, e.g., a 1-hour duration
      const end = new Date(eventData.start.getTime() + 60 * 60 * 1000);
      setEventData({ ...eventData, allDay: false, end });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventData.end < eventData.start) {
      setError('End time cannot be earlier than start time.');
      return;
    }
    setError(null);
    onSave(eventData);
  };

  const handleDelete = () => {
    if (eventData._id) {
      onDelete(eventData._id);
    }
  };

  const handleDurationPreset = (minutes: number) => {
    const newEnd = new Date(eventData.start.getTime() + minutes * 60 * 1000);
    setEventData({ ...eventData, allDay: false, end: newEnd });
  };

  const handleCustomColorChange = (nextColor: string) => {
    setCustomColor(nextColor);
    setEventData({ ...eventData, color: nextColor });
  };

  const handleDuplicate = () => {
    const offsetStart = new Date(eventData.start.getTime());
    const offsetEnd = new Date(eventData.end.getTime());
    setError(null);
    onSave({
      ...eventData,
      _id: undefined,
      title: `${eventData.title}`,
      start: offsetStart,
      end: offsetEnd,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel as={motion.div} className="w-full max-w-2xl mx-4 transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex justify-between items-center">
                  {isNewEvent ? 'Add New Event' : 'Edit Event'}
                  <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  {/* Title */}
                  <div className="relative">
                    <PencilSquareIcon className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <input
                      id="title" type="text" required
                      className="w-full rounded-md border-gray-300 py-2 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Event Title"
                      value={eventData.title}
                      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <textarea
                      id="description" rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add a description..."
                      value={eventData.description || ''}
                      onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    />
                  </div>

                  {/* Type & Color */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><TagIcon className="h-5 w-5 text-gray-500" /> Type</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(EventColorMap).map(([type, color]) => (
                          <button
                            key={type} type="button"
                            onClick={() => handleTypeChange(type as EventType)}
                            className={clsx(
                              'px-3 py-1.5 text-xs cursor-pointer font-semibold rounded-full transition-all duration-200 text-white shadow-sm',
                              'focus:outline-none focus:ring-2 focus:ring-offset-2',
                              eventData.type === type ? 'ring-2 ring-offset-2' : 'hover:scale-105 opacity-50 hover:opacity-100'
                            )}
                            style={{ backgroundColor: color as string }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Custom color</label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          aria-label="Pick custom color"
                          type="color"
                          className="h-9 w-9 cursor-pointer rounded border border-gray-200"
                          value={customColor}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                        />
                        <input
                          aria-label="Color hex"
                          type="text"
                          className="w-28 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={customColor}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            if (/^#([0-9a-fA-F]{3}){1,2}$/.test(value)) {
                              handleCustomColorChange(value);
                            } else {
                              setCustomColor(value);
                            }
                          }}
                          placeholder="#3174ad"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Overrides the type color for this event.</p>
                    </div>
                  </div>

                  <Switch.Group as="div" className="flex items-center justify-between">
                    <span className="flex-grow flex flex-col">
                      <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                        All-day event
                      </Switch.Label>
                    </span>
                    <Switch
                      checked={eventData.allDay}
                      onChange={handleAllDayToggle}
                      className={clsx(
                        eventData.allDay ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={clsx(
                          eventData.allDay ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </Switch.Group>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="start" className="text-sm font-medium text-gray-700 flex items-center gap-2"><CalendarDaysIcon className="h-5 w-5 text-gray-500" /> Start</label>
                      <input
                        id="start" type="datetime-local"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formatToDateTimeLocal(eventData.start)}
                        onChange={(e) => setEventData({ ...eventData, start: new Date(e.target.value) })}
                        disabled={eventData.allDay}
                      />
                    </div>
                    <div>
                      <label htmlFor="end" className="text-sm font-medium text-gray-700 flex items-center gap-2"><ClockIcon className="h-5 w-5 text-gray-500" /> End</label>
                      <input
                        id="end" type="datetime-local"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formatToDateTimeLocal(eventData.end)}
                        onChange={(e) => setEventData({ ...eventData, end: new Date(e.target.value) })}
                        disabled={eventData.allDay}
                      />
                    </div>
                  </div>

                  {/* Quick durations */}
                  {!eventData.allDay && (
                    <div className="-mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">Quick duration:</span>
                      <button type="button" onClick={() => handleDurationPreset(30)} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50">30m</button>
                      <button type="button" onClick={() => handleDurationPreset(60)} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50">1h</button>
                      <button type="button" onClick={() => handleDurationPreset(120)} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50">2h</button>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  <div className="pt-3 sm:pt-4">
                    {/* Mobile: Stack buttons vertically */}
                    <div className="flex flex-col gap-3 sm:hidden">
                      {!isNewEvent && (
                        <div className="flex gap-2">
                          <button
                            type="button" onClick={handleDuplicate}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                          >
                            Duplicate
                          </button>
                          <button
                            type="button" onClick={handleDelete}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-red-100 px-3 py-2.5 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors">
                          Cancel
                        </button>
                        <button type="submit" className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors">
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Horizontal layout */}
                    <div className="hidden sm:flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {!isNewEvent && (
                          <>
                            <button
                              type="button" onClick={handleDuplicate}
                              className="inline-flex items-center gap-2 justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                            >
                              Duplicate
                            </button>
                            <button
                              type="button" onClick={handleDelete}
                              className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors">
                          Cancel
                        </button>
                        <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
