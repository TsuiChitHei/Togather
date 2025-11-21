from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

import firebase_admin
from firebase_admin import credentials, auth, firestore

firebase_config_json = os.getenv("FIREBASE_ADMIN_CONFIG_JSON")
cred = credentials.Certificate(json.loads(firebase_config_json))
firebase_admin.initialize_app(cred)

db = firestore.client()

# Mock data dictionaries
MOCK_USERS = [
    {
        "id": "user-2",
        "email": "jane@test.com",
        "password": "password",
        "name": "Jane Doe",
        "year": 3,
        "faculty": "Arts and Social Sciences",
        "major": "Psychology",
        "hometown": "Vancouver",
        "interests": ["Hiking", "Photography", "Baking", "Movies"],
        "bio": "Just a psych major trying to understand the world, one cup of coffee at a time. Love capturing moments and exploring new trails!",
        "privatePrompts": {
            "prompt1": "A perfect weekend for me is being outdoors.",
            "prompt2": "I'm looking for friends who are open-minded and love to laugh.",
        },
        "joinedCommunityIds": ["comm-1", "comm-3"],
        "signedUpEventIds": ["event-1", "event-3"],
        "postIds": ["post-1", "post-3", "post-4"],
        "avatarUrl": "https://picsum.photos/seed/jane/200",
    },
    {
        "id": "user-3",
        "email": "sam@test.com",
        "password": "password",
        "name": "Sam Wilson",
        "year": 5,
        "faculty": "Engineering",
        "major": "Mechanical Engineering",
        "hometown": "Toronto",
        "interests": ["Robotics", "3D Printing", "Cycling", "Sci-Fi"],
        "bio": "Building the future, one gear at a time. Avid cyclist and sci-fi enthusiast. Let's talk tech!",
        "privatePrompts": {
            "prompt1": "Something that fascinates me is the potential of AI.",
            "prompt2": "I connect best with people who are passionate about their hobbies.",
        },
        "joinedCommunityIds": ["comm-2"],
        "signedUpEventIds": ["event-1", "event-2"],
        "postIds": ["post-2"],
        "avatarUrl": "https://picsum.photos/seed/sam/200",
    },
]

MOCK_COMMUNITIES = [
    {
        "id": "comm-1",
        "name": "Fishing Club",
        "description": "For all angling enthusiasts, from beginners to pros.",
        "memberCount": 78,
        "imageUrl": "https://picsum.photos/seed/fishing/600/400",
        "members": ["user-2"],
        "postIds": ["post-1"],
    },
    {
        "id": "comm-2",
        "name": "Fun Bouldering",
        "description": "Climb, connect, and conquer new heights together.",
        "memberCount": 123,
        "imageUrl": "https://picsum.photos/seed/bouldering/600/400",
        "members": ["user-3"],
        "postIds": ["post-2"],
    },
    {
        "id": "comm-3",
        "name": "Movie Buffs",
        "description": "Discussing everything from blockbusters to indie gems.",
        "memberCount": 210,
        "imageUrl": "https://picsum.photos/seed/movie/600/400",
        "members": ["user-2"],
        "postIds": ["post-3", "post-4"],
    },
    {
        "id": "comm-4",
        "name": "Startup Grind",
        "description": "Connect with fellow entrepreneurs and build the future.",
        "memberCount": 95,
        "imageUrl": "https://picsum.photos/seed/startup/600/400",
        "members": [],
        "postIds": [],
    },
]

MOCK_EVENTS = [
    {
        "id": "event-1",
        "name": "The Peak Social Hike",
        "time": "Today, 5pm",
        "location": "Sai Ying Pun MTR Exit A2",
        "communityId": "comm-1",
        "description": "Join us for a scenic hike up The Peak! A great way to meet new people and enjoy the amazing Hong Kong skyline. We'll meet at the MTR exit and head up together. All fitness levels welcome.",
        "imageUrl": "https://picsum.photos/seed/hike/200/200",
        "attendees": ["user-2", "user-3"],
    },
    {
        "id": "event-2",
        "name": "West Kowloon 5k Run",
        "time": "Tomorrow, 6pm",
        "location": "West Kowloon Cultural District",
        "communityId": "comm-2",
        "description": "Let's go for a casual 5k run along the beautiful West Kowloon waterfront. A perfect way to de-stress and stay active. We'll end with some stretching and social time.",
        "imageUrl": "https://picsum.photos/seed/run/200/200",
        "attendees": ["user-3"],
    },
    {
        "id": "event-3",
        "name": "Inception Screening",
        "time": "Friday, 8pm",
        "location": "Campus Cinema",
        "communityId": "comm-3",
        "description": "Join the Movie Buffs for a special screening of Christopher Nolan's masterpiece, Inception. Popcorn will be provided! We'll have a short discussion after the film.",
        "imageUrl": "https://picsum.photos/seed/cinema/200/200",
        "attendees": ["user-2"],
    },
    {
        "id": "event-4",
        "name": "Pitch Night",
        "time": "Next Tuesday, 7pm",
        "location": "Innovation Hub",
        "communityId": "comm-4",
        "description": "Have a startup idea? Come pitch it to fellow entrepreneurs and get valuable feedback. Or just come to listen and get inspired!",
        "imageUrl": "https://picsum.photos/seed/pitch/200/200",
        "attendees": [],
    },
]

MOCK_POSTS = [
    {
        "id": "post-1",
        "type": "event",
        "authorId": "user-2",
        "communityId": "comm-1",
        "timestamp": "2h ago",
        "eventId": "event-1",
        "content": "",
    },
    {
        "id": "post-2",
        "type": "text",
        "authorId": "user-3",
        "communityId": "comm-2",
        "timestamp": "5h ago",
        "content": "Just finished a new climbing route at the gym! Feeling accomplished. Anyone else hit a PR recently?",
    },
    {
        "id": "post-3",
        "type": "event",
        "authorId": "user-2",
        "communityId": "comm-3",
        "timestamp": "1d ago",
        "eventId": "event-3",
        "content": "",
    },
    {
        "id": "post-4",
        "type": "text",
        "authorId": "user-2",
        "communityId": "comm-3",
        "timestamp": "2d ago",
        "content": "Just rewatched Blade Runner 2049. What a masterpiece. What are your thoughts on it?",
    },
]

class PrivatePrompts(BaseModel):
    prompt1: str
    prompt2: str

class User(BaseModel):
    id: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    name: Optional[str] = None
    year: Optional[int] = None
    faculty: Optional[str] = None
    major: Optional[str] = None
    hometown: Optional[str] = None
    interests: Optional[List[str]] = None
    bio: Optional[str] = None
    privatePrompts: Optional[PrivatePrompts] = None
    joinedCommunityIds: Optional[List[str]] = None
    signedUpEventIds: Optional[List[str]] = None
    avatarUrl: Optional[str] = None

class Community(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    memberCount: Optional[int] = None
    imageUrl: Optional[str] = None
    members: Optional[List[str]] = None
    postIds: Optional[List[str]] = None

@app.get("/")
def health_check():
    return {"message": "Server is running"}

@app.patch("/users/{user_id}")
def update_user(user_id: str, user: User):
    user_list = db.collection("users")
    user_snapshot = user_list.where("id", "==", user_id).get()[0]
    user_ref = db.collection("users").document(user_snapshot.id)
    # Only update fields that are provided (not None)
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    user_ref.update(update_data)
    return {"message": "User updated successfully"}

@app.post("/populate-mock-data")
def populate_mock_data():
    """Populate Firestore with all mock data"""
    imported = {"users": [], "communities": [], "events": [], "posts": []}
    
    # Import users
    for user in MOCK_USERS:
        user_data = user.copy()
        _, doc_ref = db.collection("users").add(user_data)
        imported["users"].append(doc_ref.id)
    
    # Import communities
    for community in MOCK_COMMUNITIES:
        community_data = community.copy()
        _, doc_ref = db.collection("communities").add(community_data)
        imported["communities"].append(doc_ref.id)
    
    # # Import events
    for event in MOCK_EVENTS:
        event_data = event.copy()
        _, doc_ref = db.collection("events").add(event_data)
        imported["events"].append(doc_ref.id)
    
    # # Import posts
    for post in MOCK_POSTS:
        post_data = post.copy()
        _, doc_ref = db.collection("posts").add(post_data)
        imported["posts"].append(doc_ref.id)
    
    return {
        "message": "Mock data populated successfully",
        "imported": imported,
        "summary": {
            "users": len(imported["users"]),
            "communities": len(imported["communities"]),
            "events": len(imported["events"]),
            "posts": len(imported["posts"]),
        }
    }

@app.get("/communities/{community_id}")
def get_individual_community(community_id: str):
    community_list = db.collection("communities")
    community_snapshot = community_list.where("id", "==", community_id).get()[0]
    community_ref = db.collection("communities").document(community_snapshot.id)
    community = community_ref.get()
    return community.to_dict()

@app.patch("/communities/{community_id}")
def update_community(community_id: str, newCommunity: Community):
    community_list = db.collection("communities")
    community_snapshot = community_list.where("id", "==", community_id).get()[0]
    community_ref = db.collection("communities").document(community_snapshot.id)
    community_ref.update(newCommunity.model_dump())
    return {"message": "Community updated successfully"}

