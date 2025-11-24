import { Event } from "../context/AppContext";

const API_URL = "http://172.20.10.5:8000";

export const getAllEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  const data = await response.json();
  return data as Event[];
};
