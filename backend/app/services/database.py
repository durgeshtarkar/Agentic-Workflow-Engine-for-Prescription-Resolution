from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings
from fastapi import HTTPException

settings = get_settings()

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    try:
        # Re-fetch settings to ensure we have latest from .env
        from app.core.config import get_settings
        current_settings = get_settings()
        
        # Log sanitized URI (hide password)
        sanitized_uri = current_settings.MONGODB_URI
        if "@" in sanitized_uri:
            sanitized_uri = sanitized_uri.split("@")[-1]
            
        print(f"Connecting to MongoDB Cluster: {sanitized_uri}...")
        db.client = AsyncIOMotorClient(
            current_settings.MONGODB_URI, 
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        # Send a ping to confirm a successful connection
        await db.client.admin.command('ping')
        db.db = db.client[current_settings.DB_NAME]
        # Ensure email uniqueness
        await db.db.users.create_index("email", unique=True)
        print(f"Successfully interconnected with Clinical Ledger: {current_settings.DB_NAME}")
    except Exception as e:
        print(f"CRITICAL: Failed to link with Clinical Ledger (Database): {str(e)}")
        print("TIP: If you see DNS timeout, check your internet or try a different network.")
        db.db = None
        db.client = None

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_database():
    if db.db is None:
        raise HTTPException(
            status_code=503,
            detail="Clinical Ledger connection not established. Verify your MongoDB Atlas URI in the .env file."
        )
    return db.db
