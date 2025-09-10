import os
from typing import List
import google.generativeai as genai
from app.models.schemas import ScheduleRequest, Timetable, TimetableSlot


def _to_prompt(req: ScheduleRequest) -> str:
    return (
        "You are an expert timetable generator for a university. "
        "Given JSON of courses, rooms, faculty, constraints, produce an optimized weekly timetable. "
        "Respect hard constraints: no clashes per faculty/room/batch, max daily hours, room capacity/resources. "
        "Optimize soft constraints: avoid back-to-back, balanced load, labs contiguous. "
        f"Department: {req.department}, Semester: {req.semester}, Year: {req.year}. "
        "Return strictly JSON with an array named options, each having name, department, semester, year, slots[]. "
        "Each slot has day, startTime, endTime, courseCode, courseName, facultyId, roomId, batch, resources."
    )


def generate_with_gemini(req: ScheduleRequest) -> List[Timetable]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return []
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = _to_prompt(req)
    content = {
        "department": req.department,
        "semester": req.semester,
        "year": req.year,
        "constraints": req.constraints,
        "courses": req.courses,
        "rooms": req.rooms,
        "faculty": req.faculty,
        "batches": req.batches,
    }
    response = model.generate_content([prompt, {"mime_type": "application/json", "text": str(content)}])
    text = response.text or ""
    # Robust JSON extraction
    import json, re
    json_text = text
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        json_text = m.group(0)
    data = json.loads(json_text)
    options_data = data.get("options", [])
    options: List[Timetable] = []
    for opt in options_data:
        slots = [TimetableSlot(**s) for s in opt.get("slots", [])]
        options.append(Timetable(
            name=opt.get("name"),
            department=opt.get("department", req.department),
            semester=opt.get("semester", req.semester),
            year=opt.get("year", req.year),
            slots=slots,
            facultyIndex=sorted(list({s.facultyId for s in slots})),
            batchIndex=sorted(list({s.batch for s in slots if s.batch})),
            metadata={"generator": "gemini"},
        ))
    return options

