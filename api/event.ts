import { Event } from "../context/AppContext";

const API_URL = "https://togather-y3c5.onrender.com";

export const getAllEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  const data = await response.json();
  return data as Event[];
};

export const createEventInDatabase = async (newEvent: Event) => {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEvent),
  });
  return response.json();
};

export const updateEventInDatabase = async (updatedEvent: Event) => {
  const response = await fetch(`${API_URL}/events/${updatedEvent.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEvent),
  });
  return response.json();
};
