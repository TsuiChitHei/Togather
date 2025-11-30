import { Post } from "../context/AppContext";

const API_URL = "https://togather-y3c5.onrender.com"; //ttp://172.20.5.135:8000";

export const getAllPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  const data = await response.json();
  return data as Post[];
};

export const createPostInDatabase = async (newPost: Post) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  return response.json();
};
