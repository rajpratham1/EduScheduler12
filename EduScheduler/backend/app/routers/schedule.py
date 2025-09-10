from fastapi import APIRouter, Depends
from app.deps.auth import require_role
from app.models.schemas import ScheduleRequest, ScheduleResult, ConflictResolutionRequest, ConflictResolutionResult
from app.services.scheduler.engine import generate_timetables
from app.services.conflicts import resolve_conflicts


router = APIRouter()


@router.post("/schedule/generate", response_model=ScheduleResult)
def schedule_generate(req: ScheduleRequest, admin=Depends(require_role("admin"))):
    options = generate_timetables(req)
    return {"options": options}


@router.post("/conflicts/resolve", response_model=ConflictResolutionResult)
def conflicts_resolve(req: ConflictResolutionRequest, admin=Depends(require_role("admin"))):
    return resolve_conflicts(req)

