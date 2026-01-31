from sqlalchemy import (
    Column, Integer, String, Numeric, Enum, ForeignKey,
    Boolean, Text, CHAR, TIMESTAMP, Date
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class KYCStatus(str, enum.Enum):
    unverified = "unverified"
    verified = "verified"


class AccountType(str, enum.Enum):
    savings = "savings"
    checking = "checking"
    credit_card = "credit_card"
    loan = "loan"
    investment = "investment"


class TxnType(str, enum.Enum):
    debit = "debit"
    credit = "credit"


class BillStatus(str, enum.Enum):
    upcoming = "upcoming"
    paid = "paid"
    overdue = "overdue"


class AlertType(str, enum.Enum):
    low_balance = "low_balance"
    bill_due = "bill_due"
    budget_exceeded = "budget_exceeded"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String)
    kyc_status = Column(Enum(KYCStatus), default=KYCStatus.unverified)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    accounts = relationship("Account", back_populates="user")


class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    bank_name = Column(String)
    account_type = Column(Enum(AccountType))
    masked_account = Column(String)
    currency = Column(CHAR(3))
    balance = Column(Numeric)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")


class Transaction(Base):
    __tablename__ = "transactions"

    trans_id = Column(Integer, primary_key=True)
    account_id = Column(Integer, ForeignKey("accounts.account_id"))
    description = Column(String)
    category = Column(String)
    amount = Column(Numeric)
    currency = Column(CHAR(3))
    txn_type = Column(Enum(TxnType))
    merchant = Column(String)
    txn_date = Column(TIMESTAMP)

    account = relationship("Account", back_populates="transactions")


class Budget(Base):
    __tablename__ = "budgets"

    budget_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(Integer)
    year = Column(Integer)
    category = Column(String)
    limit_amount = Column(Numeric)
    spent_amount = Column(Numeric)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class Bill(Base):
    __tablename__ = "bills"

    bill_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    biller_name = Column(String)
    due_date = Column(Date)
    amount_due = Column(Numeric)
    status = Column(Enum(BillStatus))
    auto_pay = Column(Boolean)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class Reward(Base):
    __tablename__ = "rewards"

    reward_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    program_name = Column(String)
    points_balance = Column(Integer)
    last_updated = Column(TIMESTAMP)


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum(AlertType))
    message = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class AdminLog(Base):
    __tablename__ = "adminlogs"

    log_id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey("users.id"))
    action = Column(Text)
    target_type = Column(String)
    target_id = Column(Integer)
    timestamp = Column(TIMESTAMP, default=datetime.utcnow)


# 🔐 Refresh Tokens table (secure + revocable)
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    token = Column(String, unique=True, index=True)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    expires_at = Column(TIMESTAMP)


