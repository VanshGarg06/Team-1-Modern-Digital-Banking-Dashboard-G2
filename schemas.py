from pydantic import BaseModel
from datetime import datetime,date
from typing import Optional
class AccountResponse(BaseModel):
    account_id: int
    user_id: int
    bank_name: str
    account_type: str
    masked_account: str
    currency: str
    balance: float
    created_at: datetime


class BudgetCreate(BaseModel):
    user_id: int
    month: int
    year: int
    category: str
    limit_amount: float


class BudgetResponse(BaseModel):
    budget_id: int
    user_id: int
    month: int
    year: int
    category: str
    limit_amount: float
    spent_amount: float
    
class BillCreate(BaseModel):
    user_id: int
    biller_name: str
    due_date: date
    amount_due: float
    auto_pay: bool


class BillResponse(BaseModel):
    bill_id: int
    user_id: int
    biller_name: str
    due_date: date
    amount_due: float
    status: str
    auto_pay: bool


    class Config:
        from_attributes = True   
          # orm_mode = True     