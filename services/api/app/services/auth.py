from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import User

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_token(email: str) -> str:
    settings = get_settings()
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    return jwt.encode({"sub": email, "exp": expires}, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> str | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None
    subject = payload.get("sub")
    return subject if isinstance(subject, str) else None


def create_user(db: Session, name: str, email: str, password: str) -> dict:
    if db.query(User).filter(User.email == email).first():
        raise ValueError("User already exists")
    user = User(name=name, email=email, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    return {"name": name, "email": email}


def upsert_google_user(db: Session, name: str, email: str, google_sub: str, image: str | None = None) -> dict:
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.name = name or user.name
        user.image_url = image
        user.oauth_provider = "google"
        user.oauth_subject = google_sub
    else:
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(f"google-oauth:{google_sub}"),
            image_url=image,
            oauth_provider="google",
            oauth_subject=google_sub,
        )
        db.add(user)
    db.commit()
    return {"name": user.name, "email": user.email, "image": user.image_url, "provider": "google"}


def authenticate(db: Session, email: str, password: str) -> dict | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return {"name": user.name, "email": user.email}


def get_user_by_email(db: Session, email: str) -> dict | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    return {"name": user.name, "email": user.email, "image": user.image_url, "provider": user.oauth_provider}
