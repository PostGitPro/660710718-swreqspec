import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.db.models import Base
from app.db.session import init_db


# รองรับ: CON-TECH-01
@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", future=True)
    init_db(engine)
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        yield session
