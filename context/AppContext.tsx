import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  password?: string; // Should not be stored in client state in real app
  name: string;
  year: number;
  faculty: string;
  major: string;
  hometown: string;
  interests: string[];
  bio: string;
  privatePrompts: {
    prompt1: string;
    prompt2: string;
  };
  joinedCommunityIds: string[];
  signedUpEventIds: string[];
  avatarUrl: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  members: string[]; // array of user ids
}

export interface Post {
  id: string;
  type: "text" | "event";
  authorId: string;
  communityId: string;
  timestamp: string;
  content?: string;
  eventId?: string;
}

export interface Event {
  id: string;
  name: string;
  time: string;
  location: string;
  communityId: string;
  description: string;
  imageUrl: string;
  attendees: string[]; // array of user ids
}

export interface CreateEventInput {
  name: string;
  time: string;
  location: string;
  description: string;
  communityId: string;
  imageUrl?: string;
}

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  communities: Community[];
  events: Event[];
  posts: Post[];
  updateUser: (user: User) => void;
  viewCommunity: (id: string) => void;
  viewEvent: (id: string) => void;
  toggleCommunityMembership: (communityId: string) => void;
  toggleEventSignup: (eventId: string) => void;
  createEvent: (input: CreateEventInput) => Event | null;
}

export const AppContext = createContext<AppContextType | null>(null);
