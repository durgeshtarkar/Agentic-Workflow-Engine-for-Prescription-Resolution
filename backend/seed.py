import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings
from app.core.security import get_password_hash
import os

async def seed_data():
    settings = get_settings()
    print(f"Connecting to MongoDB for seeding: {settings.MONGODB_URI[:20]}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DB_NAME]
    
    # Create default user
    users_to_seed = [
        {
            "email": "admin@rxengine.com",
            "full_name": "Senior Clinical Admin",
            "hashed_password": get_password_hash("admin123"),
            "created_at": "2026-04-12T00:00:00Z",
            "role": "Super Admin"
        },
        {
            "email": "doctor@rxengine.com",
            "full_name": "Dr. Clinical Demo",
            "hashed_password": get_password_hash("password"),
            "created_at": "2026-04-12T00:00:00Z",
            "role": "doctor"
        }
    ]
    
    for u in users_to_seed:
        existing_user = await db.users.find_one({"email": u["email"]})
        if not existing_user:
            await db.users.insert_one(u)
            print(f"Created user: {u['email']} (password: {'admin123' if 'admin' in u['email'] else 'password'})")
        else:
            print(f"User {u['email']} already exists.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
