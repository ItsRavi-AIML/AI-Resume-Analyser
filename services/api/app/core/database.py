from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, String, Text, create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    oauth_provider: Mapped[str | None] = mapped_column(String(80), nullable=True)
    oauth_subject: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    file_name: Mapped[str] = mapped_column(String(255))
    payload: Mapped[dict] = mapped_column(JSON)
    report_markdown: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


def _database_url() -> str:
    return get_settings().database_url or "sqlite:///./resume_ai.db"


engine = create_engine(_database_url(), connect_args={"check_same_thread": False} if _database_url().startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_oauth_columns()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def save_report(db: Session, analysis_id: str, file_name: str, payload: dict, markdown: str) -> None:
    db.merge(AnalysisReport(id=analysis_id, file_name=file_name, payload=payload, report_markdown=markdown))
    db.commit()


def ensure_oauth_columns() -> None:
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    existing = {column["name"] for column in inspector.get_columns("users")}
    desired = {
        "image_url": "VARCHAR(500)",
        "oauth_provider": "VARCHAR(80)",
        "oauth_subject": "VARCHAR(255)",
    }

    with engine.begin() as connection:
        for column, definition in desired.items():
            if column in existing:
                continue
            if engine.dialect.name == "postgresql":
                connection.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {column} {definition}"))
            elif engine.dialect.name == "sqlite":
                connection.execute(text(f"ALTER TABLE users ADD COLUMN {column} {definition}"))
