from typing import Dict, Set
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.user_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.user_connections.setdefault(user_id, set()).add(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        connections = self.user_connections.get(user_id)
        if connections and websocket in connections:
            connections.remove(websocket)
            if not connections:
                self.user_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, message: str) -> None:
        for ws in list(self.user_connections.get(user_id, set())):
            await ws.send_text(message)

    async def broadcast(self, message: str) -> None:
        for connections in list(self.user_connections.values()):
            for ws in list(connections):
                await ws.send_text(message)


connection_manager = ConnectionManager()

