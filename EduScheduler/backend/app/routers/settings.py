from fastapi import APIRouter, Depends
from app.deps.auth import require_role
from app.deps.firebase import get_firestore_client
from app.models.schemas import Settings


router = APIRouter()


def _doc():
    return get_firestore_client().collection("meta").document("settings")


@router.get("")
def get_settings(admin=Depends(require_role("admin"))):
    d = _doc().get()
    return d.to_dict() if d.exists else {}


@router.put("")
def put_settings(s: Settings, admin=Depends(require_role("admin"))):
    _doc().set(s.model_dump(), merge=True)
    return {"updated": True}

