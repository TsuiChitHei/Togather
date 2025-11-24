from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

import firebase_admin
from firebase_admin import firestore, credentials

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# --- Function to get a collection as a list of dictionaries ---
def get_collection_as_dict(collection_ref):
    """Retrieves all documents in a collection and returns them as a list of dictionaries."""
    docs = collection_ref.stream()
    data = []
    for doc in docs:
        doc_data = doc.to_dict()
        if doc_data:
            doc_data['id'] = doc.id
            data.append(doc_data)
    return data

# --- Fetch data ---
collection_name = 'users' # Replace with your collection name
collection_ref = db.collection(collection_name)
all_documents = get_collection_as_dict(collection_ref)

users_data = {"users": all_documents}

# --- Convert to JSON format --- (optional)
# users_data = json.dumps(all_documents, indent=4, ensure_ascii=False)


# Load a pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

def find_top_similar_users(users_data, target_user_id, top_n=1, interest_attribute="interests"):
    """
    Find top N most similar users to the target user
    
    Args:
        users_data: JSON object containing list of users
        target_user_id: string ID of the target user
        top_n: number of top matches to return
        interest_attribute: attribute name for interests list
    
    Returns:
        JSON string with top N similar users (formatted with indent)
    """

    try:
        users_list = users_data.get('users', [])
        if not users_list:
            return json.dumps({"error": "No users found"}, indent=4)
        
        # Find target user
        target_user = None
        for user in users_list:
            if user.get('id') == target_user_id:
                target_user = user
                break
        
        if not target_user:
            return json.dumps({"error": f"User with ID {target_user_id} not found"}, indent=4)
        
        target_interests = target_user.get(interest_attribute, [])
        if not target_interests:
            return json.dumps({"error": f"Target user has no interests in attribute '{interest_attribute}'"}, indent=4)
        
        # Clean target interests
        target_interests = [str(interest).strip() for interest in target_interests if str(interest).strip()]
        
        similarities = []
        
        for user in users_list:
            # Skip target user
            if user.get('id') == target_user_id:
                continue
            
            user_interests = user.get(interest_attribute, [])
            if not user_interests:
                continue
            
            # Clean user interests
            user_interests = [str(interest).strip() for interest in user_interests if str(interest).strip()]
            if not user_interests:
                continue
            
            # Calculate similarity
            similarity = compare_interests_transformer(target_interests, user_interests)
            
            similarities.append({
                "user": user,
                "similarity_score": similarity
            })
        
        if not similarities:
            return json.dumps({"error": "No similar users found"}, indent=4)
        
        # Sort by similarity score (descending)
        similarities.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        # Get top N
        top_matches = similarities[:top_n]
        
        # Format results
        results = {
            "target_user": {
                "id": target_user_id,
                "name": target_user.get('name', 'Unknown'),
                "interests": target_interests
            },
            "top_matches": []
        }
        
        for match in top_matches:
            user = match['user']
            results["top_matches"].append({
                "id": user.get('id'),
                "name": user.get('name', 'Unknown'),
                # Convert numpy float32 to Python float for JSON serialization
                "similarity_score": float(match['similarity_score']),
                "interests": user.get(interest_attribute, [])
            })
        
        return json.dumps(results, indent=4, ensure_ascii=False)
    
    except Exception as e:
        return json.dumps({"error": f"An error occurred: {str(e)}"}, indent=4)


def compare_interests_transformer(interests1, interests2):
    """
    Compare two lists of interests using sentence transformers
    """

    if not interests1 or not interests2:
        return 0.0
    
    # Encode both interest lists
    embeddings1 = model.encode(interests1)
    embeddings2 = model.encode(interests2)
    
    # Calculate pairwise similarities
    similarity_matrix = cosine_similarity(embeddings1, embeddings2)
    
    # Return maximum similarity for each interest and take average
    max_similarities = np.max(similarity_matrix, axis=1)
    return np.mean(max_similarities)


# Example

# users_json = [
#     {
#         "bio": "Building the future, one gear at a time. Avid cyclist and sci-fi enthusiast. Let's talk tech!",
#         "interests": [
#             "Robotics",
#             "3D Printing",
#             "Cycling",
#             "Sci-Fi"
#         ],
#         "postIds": [
#             "post-2"
#         ],
#         "year": 5,
#         "name": "Sam Wilson",
#         "privatePrompts": {
#             "prompt1": "Something that fascinates me is the potential of AI.",
#             "prompt2": "I connect best with people who are passionate about their hobbies."
#         },
#         "avatarUrl": "https://picsum.photos/seed/sam/200",
#         "signedUpEventIds": [
#             "event-1",
#             "event-2"
#         ],
#         "email": "sam@test.com",
#         "faculty": "Engineering",
#         "joinedCommunityIds": [
#             "comm-2"
#         ],
#         "hometown": "Toronto",
#         "id": "GEzsu1L1rzXTVeUrO04z",
#         "password": "password",
#         "major": "Mechanical Engineering"
#     },
#     {
#         "bio": "Just a psych major trying to understand the world, one cup of coffee at a time. Love capturing moments and exploring new trails!",
#         "interests": [
#             "Hiking",
#             "Photography",
#             "Baking",
#             "Movies"
#         ],
#         "postIds": [
#             "post-1",
#             "post-3",
#             "post-4"
#         ],
#         "year": 3,
#         "name": "Jane Doe",
#         "privatePrompts": {
#             "prompt1": "A perfect weekend for me is being outdoors.",
#             "prompt2": "I'm looking for friends who are open-minded and love to laugh."
#         },
#         "avatarUrl": "https://picsum.photos/seed/jane/200",
#         "signedUpEventIds": [
#             "event-1",
#             "event-3"
#         ],
#         "email": "jane@test.com",
#         "faculty": "Arts and Social Sciences",
#         "joinedCommunityIds": [
#             "comm-1",
#             "comm-3"
#         ],
#         "hometown": "Vancouver",
#         "id": "N9dAvMnkaU3bH4AP7kht",
#         "password": "password",
#         "major": "Psychology"
#     }
# ]

        
# Use example: Find top similar users to ID GEzsu1L1rzXTVeUrO04z
# top_results = find_top_similar_users(users_data, "GEzsu1L1rzXTVeUrO04z", top_n=1)
# print(top_results)

# Output
# {
#     "target_user": {
#         "id": "GEzsu1L1rzXTVeUrO04z",
#         "name": "Sam Wilson",
#         "interests": [
#             "Robotics",
#             "3D Printing",
#             "Cycling",
#             "Sci-Fi"
#         ]
#     },
#     "top_matches": [
#         {
#             "id": "N9dAvMnkaU3bH4AP7kht",
#             "name": "Jane Doe",
#             "similarity_score": 0.4463004767894745,
#             "interests": [
#                 "Hiking",
#                 "Photography",
#                 "Baking",
#                 "Movies"
#             ]
#         }
#     ]
# }