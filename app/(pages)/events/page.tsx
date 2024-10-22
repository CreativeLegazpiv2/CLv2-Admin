"use client";
import { useState } from "react";
import { PaginatedTable } from "@/app/(pages)/events/components/EventsTable";
import useAuthRedirect from "@/services/authGurad/authDirect";
import { AddEvents } from "./components/AddEvents";

export default function Eventspage() {
  useAuthRedirect();

  const [addEvent, setAddEvent] = useState(!false); // Initial state should be false

  const openAddEvent = () => setAddEvent(true);
  const closeAddEvent = () => setAddEvent(false);

  return (
    <main className="flex w-full h-full items-center justify-center">
      <div className="w-full flex flex-col gap-4 h-fit overflow-hidden">
        {/* Conditional rendering with sliding animation */}

        <div
          className={`transition-all ease-in-out duration-300 ${
            addEvent ? "" : "-mt-52"
          }`}
        >
          <AddEvents onClose={closeAddEvent} />
        </div>
        <PaginatedTable openAddEvent={openAddEvent} />
      </div>
    </main>
  );
}
