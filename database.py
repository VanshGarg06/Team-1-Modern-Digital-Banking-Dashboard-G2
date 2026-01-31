# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/finance_db"

# engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# AsyncSessionLocal = sessionmaker(
#     bind=engine,
#     autoflush=False,
#     autocommit=False
# )

# Base = declarative_base()

# async def get_db():
#     async with AsyncSessionLocal() as session:
#         yield session



from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os
from dotenv import load_dotenv

load_dotenv()


password = os.getenv("DATABASE_PASSWORD")

if password is None:
    raise ValueError("DATABASE_PASSWORD is not set in .env")

DATABASE_URL = f"postgresql://postgres:{password}@localhost:5432/Mobile_Banking_Dashboard"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()