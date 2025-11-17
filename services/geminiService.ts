
// import { GoogleGenAI } from "@google/genai";
import { User } from '../context/AppContext';

// Assumes API_KEY is set in the environment
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMatchDescription = async (user1: User, user2: User): Promise<string> => {
  const prompt = `
    You are a friendly matchmaking assistant for a university social app.
    Your goal is to write a short, intriguing, and friendly one-sentence description about why two students might get along, based on their shared interests.
    Do not reveal all their interests. Just hint at a common ground to spark a conversation.
    Keep it concise and encouraging.

    Person 1's interests: ${user1.interests.join(', ')}
    Person 2's interests: ${user2.interests.join(', ')}

    Example Output: "It looks like you both have a passion for creative pursuits!"
    Example Output: "You might connect over your shared love for the great outdoors!"

    Now, generate a description for Person 1 and Person 2.
  `;

  try {
    // const response = await ai.models.generateContent({
    //     model: 'gemini-2.5-flash',
    //     contents: prompt
    // });
    // return response.text.trim();
    return "It looks like you two have some interesting hobbies in common!!!"
  } catch (error) {
    console.error("Error generating match description:", error);
    return "It looks like you two have some interesting hobbies in common!";
  }
};
