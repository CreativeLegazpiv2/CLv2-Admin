"use client";

import { useEffect, useState } from "react";

interface RegisteredUser {
  first_name: string;
  last_name: string;
  email: string;
  phoneNum: string;
  gender: string;
  artExp: string;
  subjectExp: string;
  portfolioLink: string;
  fb: string;
  ig: string;
}

interface Event {
  id: number;
  title: string;
  desc: string;
  location: string;
}

export function RegisteredEventPage({ event }: { event: Event }) {
  const [isevent, setEvent] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    if (event) {
      // Fetch event details based on the id
      fetch(`/api/events/${event.id}`)
        .then((response) => response.json())
        .then((data) => setEvent(data))
        .catch((error) => console.error("Error fetching event details:", error));
    }
  }, [event]);

  if (!isevent.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Event Details Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Event Details</h1>
        <p><strong>ID:</strong> {event.id}</p>
        <p><strong>Title:</strong> {event.title}</p>
        <p><strong>Description:</strong> {event.desc}</p>
        <p><strong>Location:</strong> {event.location}</p>
      </div>

      {/* Registered Users Section */}
      <div className="overflow-y-auto max-h-[60vh] sm:max-h-[70vh] border rounded-lg p-4 bg-gray-50">
        {isevent.map((user, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNum}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Art Experience:</strong> {user.artExp}</p>
            <p><strong>Subject Experience:</strong> {user.subjectExp}</p>
            <p>
              <strong>Portfolio:</strong>{" "}
              <a href={user.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {user.portfolioLink}
              </a>
            </p>
            <p>
              <strong>Facebook:</strong>{" "}
              <a href={user.fb} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {user.fb}
              </a>
            </p>
            <p>
              <strong>Instagram:</strong>{" "}
              <a href={user.ig} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {user.ig}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}