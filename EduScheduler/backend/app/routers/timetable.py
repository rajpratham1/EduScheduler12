from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth import get_current_user_dict, require_role
from app.deps.firebase import get_firestore_client
from app.models.schemas import Timetable


router = APIRouter()


def _collection():
    return get_firestore_client().collection("timetables")


@router.post("/admin/timetable")
def create_timetable(tt: Timetable, admin=Depends(require_role("admin"))):
    doc = _collection().document()
    # Build indexes for fast queries
    faculty_ids = sorted({s.facultyId for s in tt.slots})
    batches = sorted({s.batch for s in tt.slots if s.batch})
    tt.id = doc.id
    data = tt.model_dump()
    data["facultyIndex"] = faculty_ids
    data["batchIndex"] = batches
    doc.set(data)
    return tt


@router.get("/admin/timetable")
def list_timetables(department: str | None = None, admin=Depends(require_role("admin"))):
    q = _collection()
    if department:
        q = q.where("department", "==", department)
    return [d.to_dict() for d in q.stream()]


@router.get("/admin/timetable/{tt_id}")
def get_timetable(tt_id: str, admin=Depends(require_role("admin"))):
    doc = _collection().document(tt_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Not found")
    return doc.to_dict()


@router.put("/admin/timetable/{tt_id}")
def update_timetable(tt_id: str, tt: Timetable, admin=Depends(require_role("admin"))):
    faculty_ids = sorted({s.facultyId for s in tt.slots})
    batches = sorted({s.batch for s in tt.slots if s.batch})
    data = tt.model_dump()
    data["facultyIndex"] = faculty_ids
    data["batchIndex"] = batches
    _collection().document(tt_id).set(data, merge=True)
    return {"updated": True}


@router.delete("/admin/timetable/{tt_id}")
def delete_timetable(tt_id: str, admin=Depends(require_role("admin"))):
    _collection().document(tt_id).delete()
    return {"deleted": True}


@router.get("/faculty/timetable")
def faculty_timetable(user=Depends(require_role("faculty", "admin"))):
    uid = user["uid"]
    # Query via index
    docs = _collection().where("facultyIndex", "array_contains", uid).stream()
    return [d.to_dict() for d in docs]


@router.get("/student/timetable")
def student_timetable(user=Depends(require_role("student", "admin"))):
    batch = user.get("batch")
    if not batch:
        return []
    docs = _collection().where("batchIndex", "array_contains", batch).stream()
    return [d.to_dict() for d in docs]

