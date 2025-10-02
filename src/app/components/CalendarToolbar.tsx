// components/CalendarToolbar.tsx
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { ToolbarProps } from 'react-big-calendar';
import { View } from 'react-big-calendar';
import clsx from 'clsx';
import { CalendarEvent } from '../types';

const viewOptions: { view: View; label: string }[] = [
    { view: 'month', label: 'Month' },
    { view: 'week', label: 'Week' },
    { view: 'day', label: 'Day' },
    { view: 'agenda', label: 'Agenda' },
];

const CalendarToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    return (
        <div className="flex flex-col gap-3 p-3 sm:p-4 border-b bg-gray-50">
            {/* Navigation Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToCurrent}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Today
                    </button>
                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={goToBack}
                            aria-label="Previous"
                        >
                            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={goToNext}
                            aria-label="Next"
                        >
                            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 text-center min-w-0 flex-1 px-2">
                    {toolbar.label}
                </h2>
            </div>

            {/* View Options Row */}
            <div className="flex items-center justify-center">
                <div className="flex items-center bg-gray-200 p-1 rounded-lg gap-1">
                    {viewOptions.map(({ view, label }) => (
                        <button
                            key={view}
                            onClick={() => toolbar.onView(view)}
                            className={clsx(
                                'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
                                toolbar.view === view
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-300'
                            )}
                        >
                            <span className="hidden sm:inline">{label}</span>
                            <span className="sm:hidden">{label.charAt(0)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { CalendarToolbar };