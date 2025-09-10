import os
import json
from functools import lru_cache
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore


def init_firebase() -> None:
    if firebase_admin._apps:
        return
    cred: Optional[credentials.Base] = None
    inline_json = os.getenv("FIREBASE_CREDENTIALS")
    cred_file = os.getenv("FIREBASE_CREDENTIALS_FILE") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if inline_json:
        cred = credentials.Certificate(json.loads(inline_json))
    elif cred_file and os.path.exists(cred_file):
        cred = credentials.Certificate(cred_file)
    else:
        cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)


@lru_cache(maxsize=1)
def get_firestore_client():
    return firestore.client()

