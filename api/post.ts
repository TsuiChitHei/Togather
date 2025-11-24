import { Post } from "../context/AppContext";

const API_URL = "http://172.20.10.5:8000";

export const getAllPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  const data = await response.json();
  return data as Post[];
};
