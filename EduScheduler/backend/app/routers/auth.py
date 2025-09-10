from fastapi import APIRouter, Depends
from app.deps.auth import get_current_user_dict


router = APIRouter()


@router.get("/me")
def me(user=Depends(get_current_user_dict)):
    return user

