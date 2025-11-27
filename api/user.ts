import { User } from "../context/AppContext";

const API_URL = "http://172.29.29.191:8000";

export const updateUserInDatabase = async (updatedUser: User) => {
  const response = await fetch(`${API_URL}/users/${updatedUser.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  });
  return response.json();
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();
  return data as User[];
};

export const findSimilarUsers = async (userId: string, eventId: string) => {
  const response = await fetch(
    `${API_URL}/find-similar-users?user_id=${userId}&event_id=${eventId}`
  );
  const data = await response.json();
  return data.top_matches;
};

export const createUserInDatabase = async (newUser: User) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  return response.json();
};
