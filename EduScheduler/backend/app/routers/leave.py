from fastapi import APIRouter, Depends
from app.deps.auth import require_role
from app.deps.firebase import get_firestore_client
from app.models.schemas import LeaveRequest
from app.services.notifications import connection_manager


router = APIRouter()


@router.post("")
async def request_leave(req: LeaveRequest, faculty=Depends(require_role("faculty", "admin"))):
    db = get_firestore_client()
    doc = db.collection("leaves").document()
    payload = req.model_dump()
    payload["uid"] = faculty["uid"]
    doc.set(payload)
    # naive: broadcast a notification; in real use, re-run scheduling for affected slots
    await connection_manager.broadcast(f"Faculty {faculty['uid']} requested leave on {', '.join(req.dates)}")
    return {"submitted": True}

