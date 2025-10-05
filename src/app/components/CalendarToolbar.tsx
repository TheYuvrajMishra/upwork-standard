// components/CalendarToolbar.tsx
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { ToolbarProps } from "react-big-calendar";
import { View } from "react-big-calendar";
import clsx from "clsx";
import { CalendarEvent } from "../types";

const viewOptions: { view: View; label: string }[] = [
  { view: "month", label: "Month" },
  { view: "week", label: "Week" },
  { view: "day", label: "Day" },
  { view: "agenda", label: "Agenda" },
];

const CalendarToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-2  rounded-t-lg border-b">
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        <button
          onClick={goToCurrent}
          className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Today
        </button>
        <div className="flex items-center">
          <button
            className="p-1.5 rounded-md hover:bg-gray-200"
            onClick={goToBack}
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mx-2 sm:mx-4 w-40 text-center">
            {toolbar.label}
          </h2>
          <button
            className="p-1.5 rounded-md hover:bg-gray-200"
            onClick={goToNext}
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex items-center bg-gray-200 p-1 rounded-lg gap-1">
        {viewOptions.map(({ view, label }) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={clsx(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              toolbar.view === view
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-600 hover:bg-gray-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { CalendarToolbar };
