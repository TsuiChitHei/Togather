import { User } from "../context/AppContext";

const API_URL = "https://togather-y3c5.onrender.com";

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
