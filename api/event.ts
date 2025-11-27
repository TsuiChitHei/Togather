import { Event } from "../context/AppContext";

const API_URL = "http://172.29.29.191:8000";

export const getAllEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  const data = await response.json();
  return data as Event[];
};
