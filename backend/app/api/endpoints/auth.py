from fastapi import APIRouter, HTTPException, Depends, status
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

router = APIRouter()

from app.models.user import UserRegister, UserLogin, UserUpdate, Token

@router.post("/register", response_model=dict)
async def register(user: UserRegister, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password and save user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_dict)
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Find user
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create token
    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "email": db_user["email"],
        "full_name": db_user.get("full_name", "Clinical User"),
        "role": db_user.get("role", "doctor")
    }

from app.api.deps import get_current_user


@router.get("/me", response_model=dict)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_data = current_user.copy()
    user_data["_id"] = str(user_data["_id"])
    if "hashed_password" in user_data:
        del user_data["hashed_password"]
    return user_data

@router.post("/update-profile", response_model=dict)
async def update_profile(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        update_data = {"full_name": data.full_name}
        
        # Only handle password update if new_password is provided and not empty
        if data.new_password and data.new_password.strip():
            # For password changes, current password MUST be valid
            if not data.current_password:
                 raise HTTPException(status_code=400, detail="Current password is required to set a new password")
            
            if not verify_password(data.current_password, current_user["hashed_password"]):
                 raise HTTPException(status_code=400, detail="The current password you entered is incorrect")
            
            update_data["hashed_password"] = get_password_hash(data.new_password)
        
        result = await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )
        
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Account not found in database")
            
        return {"message": "Profile updated successfully"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"[ERROR] Profile Update Failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

