import os

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from app.db.models import Base


# รองรับ: CON-TECH-01
def get_engine(database_url: str | None = None) -> Engine:
    url = database_url or os.getenv("DATABASE_URL", "sqlite:///:memory:")
    return create_engine(url, future=True)


# รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
def init_db(engine: Engine | None = None) -> Engine:
    db_engine = engine or get_engine()
    Base.metadata.create_all(bind=db_engine)
    return db_engine
