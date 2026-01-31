from datetime import datetime, timedelta, timezone
from typing import Annotated
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import select, update
from models import User, RefreshToken
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import os

ACCESS_SECRET = os.getenv("ACCESS_SECRET", "access_secret")
REFRESH_SECRET = os.getenv("REFRESH_SECRET", "refresh_secret")

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_EXPIRE_MIN = 15
REFRESH_EXPIRE_DAYS = 7

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

def hash_password(password: str):
    return pwd.hash(password)


def verify_password(password: str, hashed: str):
    return pwd.verify(password, hashed)


def create_access_token(user_id: int):
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRE_MIN)
    }
    return jwt.encode(payload, ACCESS_SECRET, algorithm="HS256")


async def create_refresh_token(user_id: int, db: AsyncSession):
    token = str(uuid.uuid4())
    expires = datetime.utcnow() + timedelta(days=REFRESH_EXPIRE_DAYS)

    db.add(RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=expires
    ))
    await db.commit()
    return token


async def rotate_refresh_token(old_token: str, db: AsyncSession):
    q = select(RefreshToken).where(
        RefreshToken.token == old_token,
        RefreshToken.is_revoked == False
    )
    res = await db.execute(q)
    tok = res.scalar_one_or_none()

    if not tok:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Normalize datetime comparison
    now = datetime.now(timezone.utc)

    if tok.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=401, detail="Refresh token expired")

    if tok.is_revoked is True:
        raise HTTPException(status_code=401, detail="Refresh token revoked")

    # ---- REVOKE OLD TOKEN ----
    tok.is_revoked = True
    db.add(tok)
    await db.flush()   # important
    await db.commit()

    # ---- CREATE NEW TOKEN ----
    return await create_refresh_token(int(tok.user_id), db)
