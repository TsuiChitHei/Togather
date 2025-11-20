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


db = firestore.client()  # Optional: Firestore access

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

@app.get("/")
def read_root():
    users_ref = db.collection("users")
    docs = users_ref.stream()

    users = []
    for doc in docs:
        users.append(doc.to_dict())
    return {"users": users}

@app.patch("/users/{user_id}")
def update_user(user_id: str, user: User):
    user_ref = db.collection("users").document(user_id)
    # Only update fields that are provided (not None)
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    user_ref.update(update_data)
    return {"message": "User updated successfully"}
