from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl, EmailStr


class UserProfile(BaseModel):
    uid: str
    email: EmailStr
    role: str = Field(pattern="^(admin|faculty|student)$")
    displayName: Optional[str] = None
    photoURL: Optional[HttpUrl] = None
    avatar: Optional[str] = None
    department: Optional[str] = None
    facultyId: Optional[str] = None
    studentId: Optional[str] = None
    batch: Optional[str] = None
    year: Optional[int] = None


class TimetableSlot(BaseModel):
    id: Optional[str] = None
    day: str
    startTime: str
    endTime: str
    courseCode: str
    courseName: str
    facultyId: str
    roomId: str
    batch: Optional[str] = None
    resources: Optional[List[str]] = None


class Timetable(BaseModel):
    id: Optional[str] = None
    name: str
    department: str
    semester: Optional[str] = None
    year: Optional[int] = None
    slots: List[TimetableSlot] = []
    facultyIndex: List[str] = []
    batchIndex: List[str] = []
    metadata: Dict[str, Any] = {}


class ScheduleRequest(BaseModel):
    department: str
    year: Optional[int] = None
    semester: Optional[str] = None
    constraints: Dict[str, Any] = {}
    courses: List[Dict[str, Any]] = []
    rooms: List[Dict[str, Any]] = []
    faculty: List[Dict[str, Any]] = []
    batches: List[Dict[str, Any]] = []
    use_gemini: bool = True


class ScheduleResult(BaseModel):
    options: List[Timetable]


class ConflictResolutionRequest(BaseModel):
    timetableId: str
    conflicts: List[Dict[str, Any]]


class ConflictResolutionResult(BaseModel):
    suggestions: List[Dict[str, Any]]


class LeaveRequest(BaseModel):
    facultyId: str
    dates: List[str]
    reason: Optional[str] = None


class Settings(BaseModel):
    adminFeedbackEmail: Optional[EmailStr] = None
    campus: Optional[str] = None
    enableInstantNotify: bool = True
    geminiEnabled: bool = True

