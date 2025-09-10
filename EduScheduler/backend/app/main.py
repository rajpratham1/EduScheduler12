from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.deps.firebase import init_firebase
from app.deps.auth import verify_firebase_token
from app.services.notifications import connection_manager
from app.routers import auth as auth_router
from app.routers import profiles as profiles_router
from app.routers import timetable as timetable_router
from app.routers import schedule as schedule_router
from app.routers import settings as settings_router
from app.routers import feedback as feedback_router
from app.routers import leave as leave_router


init_firebase()

app = FastAPI(title="EduScheduler API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])  # /auth/me
app.include_router(profiles_router.router, prefix="/users", tags=["users"])  # /users/profile
app.include_router(timetable_router.router, tags=["timetable"])  # /admin/timetable, /faculty/timetable, /student/timetable
app.include_router(schedule_router.router, tags=["schedule"])  # /schedule/generate, /conflicts/resolve
app.include_router(settings_router.router, prefix="/settings", tags=["settings"])  # admin email, etc
app.include_router(feedback_router.router, prefix="/feedback", tags=["feedback"])  # feedback -> email
app.include_router(leave_router.router, prefix="/leave", tags=["leave"])  # faculty leave management


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok"}


@app.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, token: Optional[str] = None):
    if not token:
        await websocket.close(code=4401)
        return
    try:
        claims = verify_firebase_token(token)
        user_id = claims.get("uid")
        if not user_id:
            raise ValueError("uid missing in token")
    except Exception:
        await websocket.close(code=4401)
        return

    await connection_manager.connect(user_id, websocket)
    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_text(message)
    except WebSocketDisconnect:
        connection_manager.disconnect(user_id, websocket)
    except Exception:
        connection_manager.disconnect(user_id, websocket)
        raise

