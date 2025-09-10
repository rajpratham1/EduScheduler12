from typing import Any, Dict, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as fb_auth

from app.deps.firebase import get_firestore_client


security = HTTPBearer(auto_error=False)


def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    try:
        claims = fb_auth.verify_id_token(id_token)
        if not claims.get("email_verified"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
        provider = (claims.get("firebase") or {}).get("sign_in_provider")
        email = claims.get("email")
        if provider != "google.com" or not (email and email.endswith("@gmail.com")):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Gmail Google sign-in required")
        return claims
    except fb_auth.InvalidIdTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token verification failed")


def get_current_user_dict(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Dict[str, Any]:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization required")
    claims = verify_firebase_token(credentials.credentials)
    uid = claims.get("uid")
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    db = get_firestore_client()
    user_doc = db.collection("users").document(uid).get()
    if user_doc.exists:
        user_data = user_doc.to_dict() or {}
    else:
        user_data = {
            "uid": uid,
            "email": claims.get("email"),
            "role": "student",
            "displayName": claims.get("name"),
            "photoURL": claims.get("picture"),
        }
        db.collection("users").document(uid).set(user_data)
    return user_data


def require_role(*allowed_roles: str):
    def _dep(user: Dict[str, Any] = Depends(get_current_user_dict)) -> Dict[str, Any]:
        role = (user or {}).get("role")
        if role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user
    return _dep

