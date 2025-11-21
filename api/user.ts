import { User } from "../context/AppContext";

const API_URL = "http://172.20.6.41:8000";

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
