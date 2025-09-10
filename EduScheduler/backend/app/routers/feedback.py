import os
import aiosmtplib
from email.message import EmailMessage
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from app.deps.auth import require_role
from app.deps.firebase import get_firestore_client


router = APIRouter()


class Feedback(BaseModel):
    subject: str
    message: str


def _admin_email() -> str | None:
    db = get_firestore_client()
    d = db.collection("meta").document("settings").get()
    if d.exists:
        return (d.to_dict() or {}).get("adminFeedbackEmail")
    return None


async def _send_email(to_email: str, subject: str, body: str) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    sender = os.getenv("SMTP_FROM", smtp_user or "no-reply@eduscheduler")
    if not smtp_host or not smtp_user or not smtp_pass:
        raise RuntimeError("SMTP not configured")
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)
    await aiosmtplib.send(msg, hostname=smtp_host, port=smtp_port, start_tls=True, username=smtp_user, password=smtp_pass)


@router.post("/student")
async def student_feedback(payload: Feedback, student=Depends(require_role("student", "admin"))):
    email = _admin_email()
    if not email:
        raise HTTPException(status_code=503, detail="Admin feedback email not configured")
    body = f"From student {student['uid']} ({student.get('email')}):\n\n{payload.message}"
    await _send_email(email, f"[Student Feedback] {payload.subject}", body)
    return {"sent": True}


@router.post("/faculty")
async def faculty_feedback(payload: Feedback, faculty=Depends(require_role("faculty", "admin"))):
    email = _admin_email()
    if not email:
        raise HTTPException(status_code=503, detail="Admin feedback email not configured")
    body = f"From faculty {faculty['uid']} ({faculty.get('email')}):\n\n{payload.message}"
    await _send_email(email, f"[Faculty Feedback] {payload.subject}", body)
    return {"sent": True}

