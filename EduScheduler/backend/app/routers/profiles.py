from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth import get_current_user_dict, require_role
from app.models.schemas import UserProfile
from app.deps.firebase import get_firestore_client


router = APIRouter()


@router.get("/profile")
def get_profile(user=Depends(get_current_user_dict)):
    return user


@router.put("/profile")
def update_profile(payload: UserProfile, user=Depends(get_current_user_dict)):
    if payload.uid != user["uid"]:
        raise HTTPException(status_code=403, detail="Cannot modify other profile")
    db = get_firestore_client()
    db.collection("users").document(user["uid"]).set(payload.model_dump(), merge=True)
    return {"updated": True}


@router.post("/role")
def set_role(uid: str, role: str, admin=Depends(require_role("admin"))):
    if role not in ["admin", "faculty", "student"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    db = get_firestore_client()
    db.collection("users").document(uid).set({"role": role}, merge=True)
    return {"updated": True}

