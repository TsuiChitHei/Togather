import { Community } from "../context/AppContext";

const API_URL = "https://togather-y3c5.onrender.com"; //ttp://172.20.5.135:8000";

export const getIndividualCommunityFromDatabase = async (
  communityId: string
) => {
  const response = await fetch(`${API_URL}/communities/${communityId}`);
  const data = await response.json();
  return data as Community;
};

export const updateCommunityInDatabase = async (newCommunity: Community) => {
  const response = await fetch(`${API_URL}/communities/${newCommunity.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCommunity),
  });
  return response.json();
};

export const getAllCommunities = async () => {
  const response = await fetch(`${API_URL}/communities`);
  const data = await response.json();
  return data as Community[];
};
