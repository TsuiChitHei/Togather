import { Post } from "../context/AppContext";

const API_URL = "http://172.29.29.191:8000";

export const getAllPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  const data = await response.json();
  return data as Post[];
};
