from typing import List
from app.models.schemas import ScheduleRequest, Timetable, TimetableSlot
from app.services.scheduler.gemini import generate_with_gemini


DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]


def _heuristic(req: ScheduleRequest) -> List[Timetable]:
    options: List[Timetable] = []
    for variant in range(2):
        slots: List[TimetableSlot] = []
        hour = 9 + variant
        day_index = 0
        faculty_index: set[str] = set()
        batch_index: set[str] = set()
        for course in req.courses:
            for _ in range(course.get("perWeek", 2)):
                day = DAYS[day_index % len(DAYS)]
                start = f"{hour:02d}:00"
                end = f"{hour:02d}:50"
                slots.append(TimetableSlot(
                    day=day,
                    startTime=start,
                    endTime=end,
                    courseCode=course["code"],
                    courseName=course["name"],
                    facultyId=course["facultyId"],
                    roomId=course.get("preferredRoomId", "AUTO"),
                    batch=course.get("batch"),
                    resources=course.get("resources", []),
                ))
                faculty_index.add(course["facultyId"])
                if course.get("batch"):
                    batch_index.add(course["batch"])
                hour += 2
                if hour >= 17:
                    hour = 9 + variant
                    day_index += 1
        options.append(Timetable(
            name=f"Auto-{req.department}-{req.semester or 'S'}-opt{variant+1}",
            department=req.department,
            semester=req.semester,
            year=req.year,
            slots=slots,
            facultyIndex=sorted(list(faculty_index)),
            batchIndex=sorted(list(batch_index)),
            metadata={"generator": "heuristic"},
        ))
    return options


def generate_timetables(req: ScheduleRequest) -> List[Timetable]:
    if req.use_gemini:
        try:
            gemini_options = generate_with_gemini(req)
            if gemini_options:
                return gemini_options
        except Exception:
            pass
    return _heuristic(req)

