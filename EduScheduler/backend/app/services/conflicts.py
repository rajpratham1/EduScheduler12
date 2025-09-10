from typing import Dict, Any, List
from app.models.schemas import ConflictResolutionRequest


def resolve_conflicts(req: ConflictResolutionRequest) -> Dict[str, Any]:
    out: List[Dict[str, Any]] = []
    for c in req.conflicts:
        out.append({
            "type": c.get("type", "overlap"),
            "slotId": c.get("slotId"),
            "suggested": {
                "newStart": c.get("startTime", "10:00"),
                "newEnd": c.get("endTime", "10:50"),
                "alternativeRoomId": "R-ALT-101",
            }
        })
    return {"suggestions": out}

