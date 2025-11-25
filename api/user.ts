import { User } from "../context/AppContext";

const API_URL = "http://192.168.1.235:8000";

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
