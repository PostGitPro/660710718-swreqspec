from datetime import date, time

from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.db.models import AuditLog, Base, Booking, Slot
from app.db.session import get_engine, init_db


def test_T01_database_schema_and_sqlite_memory_session():
    engine = get_engine("sqlite:///:memory:")
    init_db(engine)

    inspector = inspect(engine)
    assert {"slots", "bookings", "audit_logs"}.issubset(set(inspector.get_table_names()))

    with Session(engine) as session:
        slot = Slot(
            slot_date=date(2026, 9, 24),
            start_time=time(9, 0),
            package_code="PKG-A",
            capacity=5,
            remaining=5,
        )
        session.add(slot)
        session.commit()
        session.refresh(slot)

        booking = Booking(
            hn="HN-001",
            slot_id=slot.id,
            booking_date=date(2026, 9, 24),
            queue_no="A-001",
            status="booked",
        )
        session.add(booking)
        session.commit()

        audit_log = AuditLog(
            actor_id="user-1",
            action="view_booking",
            hn="HN-001",
        )
        session.add(audit_log)
        session.commit()

    with Session(engine) as session:
        assert session.query(Slot).count() == 1
        assert session.query(Booking).count() == 1
        assert session.query(AuditLog).count() == 1
