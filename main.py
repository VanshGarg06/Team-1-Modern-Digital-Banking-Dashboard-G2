
from collections import defaultdict
from concurrent.futures import process
import os
from sqlalchemy.sql import func
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Annotated, cast
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import date, datetime
from collections import defaultdict
from sqlalchemy.sql import func, extract
import models
from database import SessionLocal, engine
from schemas import AccountResponse,BudgetCreate,BudgetResponse,BillCreate,BillResponse

from dotenv import load_dotenv; load_dotenv()
app = FastAPI()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]
        
class AccountUpdate(BaseModel):
    bank_name: str
    balance: float
    account_type: models.AccountType
    masked_account: str
    currency: str
    user_id:int
    
    
class BillUpdate(BaseModel):
    biller_name: Optional[str] = None
    due_date: Optional[str] = None
    amount_due: Optional[float] = None
    status: Optional[str] = None   # upcoming / paid / overdue
    auto_pay: Optional[bool] = None
    
    
class RewardCreate(BaseModel):
    user_id: int
    program_name: str
    points_balance: int
    
class RewardUpdate(BaseModel):
    program_name: Optional[str] = None
    points_balance: Optional[int] = None


        
# @app.get("/users/", response_model=List[models.User])
# def read_users(skip: int = 0, limit: int = 10, db: db_dependency):
#     users = db.query(models.User).offset(skip).limit(limit).all()
#     return users
# @app.post("/users/", response_model=models.User)
# def create_user(user: models.User, db: db_dependency):
#     db_user = models.User(
#         name=user.name,
#         email=user.email,
#         password=user.password,
#         phone=user.phone
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


@app.get("/")
def read_root():
    return {"message": "Welcome to the Mobile Banking Dashboard API"}


@app.get("/accounts/", response_model=List[AccountResponse])
def read_accounts(db: db_dependency, skip: int = 0, limit: int = 10 ):
    accounts = db.query(models.Account).offset(skip).limit(limit).all()
    if not accounts:
        print("Not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Accounts not found for the user")
    return accounts

account_num = 1

@app.post("/accounts", response_model=AccountResponse)
def create_account(account: AccountUpdate, db: db_dependency):
    db_account = models.Account(
        bank_name=account.bank_name,
        account_type=account.account_type,
        balance=account.balance,
        masked_account=(os.getenv('ACCOUNT_NUMBER_PREFIX','1234-5678-900')) + str(account_num).zfill(4),
        currency=account.currency,
        user_id=account.user_id,
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account
@app.get("/accounts/{account_id}", response_model=AccountResponse)
def read_user_accounts(account_id: int, db: db_dependency):
    accounts = db.query(models.Account).filter(models.Account.account_id == account_id).first()
    if not accounts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Accounts not found for the user")
    return accounts

@app.delete("/accounts/{account_id}")
def delete_account(account_id: int, db: db_dependency):
    account = db.query(models.Account).filter(models.Account.account_id == account_id).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    db.delete(account)
    db.commit()
    db.refresh(account)
    return account

@app.put("/accounts/{account_id}", response_model=AccountResponse)
def update_account(account_id: int, account_update: AccountUpdate, db: db_dependency):
    account = db.query(models.Account).filter(models.Account.account_id == account_id).first()
    if not account:
        raise HTTPException(404, "Account not found")

    for key, value in account_update.dict().items():
        setattr(account, key, value)

    db.commit()
    db.refresh(account)
    return account

# Week 3 different categories
CATEGORIES = [
    "Food",
    "Shopping",
    "Transport",
    "Bills",
    "Entertainment",
    "Health",
    "Travel",
    "Others"
]

@app.get("/categories")
def get_categories():
    return CATEGORIES


# Week 3 logic of Categories and Auto categorization
CATEGORY_KEYWORDS = {
    "Food": ["swiggy", "zomato", "restaurant", "cafe"],
    "Shopping": ["amazon", "flipkart", "mall"],
    "Transport": ["uber", "ola", "fuel", "metro"],
    "Bills": ["electricity", "water", "internet", "mobile"]
}


# Week 3 Auto categorization endpoint
@app.post("/transactions/auto-categorize")
def auto_categorize_transactions(user_id: int, db: db_dependency):
    transactions = (
        db.query(models.Transaction)
        .join(models.Account)
        .filter(models.Account.user_id == user_id)
        .all()
    )

    updated = 0

    for txn in transactions:
        text = f"{txn.description or ''} {txn.merchant or ''}".lower()

        for category, keywords in CATEGORY_KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                category = cast(str,txn.category)
                updated += 1
                break

    db.commit()

    return {
        "message": "Auto-categorization completed",
        "updated_transactions": updated
    }


# Week 3 logic of Categorzation of transactions
@app.put("/transactions/{transaction_id}/category")
def update_transaction_category(
    transaction_id: int,
    category: str,
    db: db_dependency
):
    if category not in CATEGORIES:
        raise HTTPException(400, "Invalid category")

    txn = db.query(models.Transaction)\
            .filter(models.Transaction.id == transaction_id)\
            .first()

    if not txn:
        raise HTTPException(404, "Transaction not found")

    category = cast(str,txn.category)
    db.commit()
    db.refresh(txn)
    return txn



# Week 4 logic of inserting budget entries
@app.post("/budgets", response_model=BudgetResponse)
def create_budget(budget: BudgetCreate, db: db_dependency):
    new_budget = models.Budget(
        user_id=budget.user_id,
        month=budget.month,
        year=budget.year,
        category=budget.category,
        limit_amount=budget.limit_amount,
        spent_amount=0
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget



# Week 4 logic of budget calculation and alerting would go here
@app.get("/budgets/progress")
def get_budget_progress(user_id: int, month: int, year: int, db: db_dependency):
    budgets = db.query(models.Budget)\
        .filter(models.Budget.user_id == user_id,
                models.Budget.month == month,
                models.Budget.year == year)\
        .all()

    response = []

    for budget in budgets:
        spent = (
            db.query(func.sum(models.Transaction.amount))
            .join(models.Account)
            .filter(
                models.Account.user_id == user_id,
                models.Transaction.category == budget.category,
                extract("month", models.Transaction.txn_date) == month,
                extract("year", models.Transaction.txn_date) == year,
                models.Transaction.txn_type == "debit"
            )
            .scalar()
        ) or 0

        limit = float(cast(Decimal, budget.limit_amount))
        spent = float(spent)
        percentage = (spent / limit * 100) if limit > 0 else 0

        response.append({
            "category": budget.category,
            "limit": limit,
            "spent": spent,
            "percentage": round(percentage, 2),
            "exceeded": spent > limit
        })

    return response

# Week 4 logic for Bills management


@app.post("/bills", response_model=BillResponse)
def create_bill(bill: BillCreate, db: db_dependency):
    new_bill = models.Bill(
        user_id=bill.user_id,
        biller_name=bill.biller_name,
        due_date=bill.due_date,
        amount_due=bill.amount_due,
        status="upcoming",
        auto_pay=bill.auto_pay
    )
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)
    return new_bill


@app.get("/bills", response_model=List[BillResponse])
def get_bills(user_id: int, db: db_dependency):
    return ( db.query(models.Bill)\
        .filter(models.Bill.user_id == user_id)\
        .order_by(models.Bill.due_date)\
        .all()
    )   


@app.put("/bills/{bill_id}", response_model=BillResponse)
def update_bill(bill_id: int, bill_update: BillUpdate, db: db_dependency):
    bill = db.query(models.Bill)\
             .filter(models.Bill.id == bill_id)\
             .first()

    if not bill:
        raise HTTPException(404, "Bill not found")

    for key, value in bill_update.dict(exclude_unset=True).items():
        setattr(bill, key, value)

    db.commit()
    db.refresh(bill)
    return bill


@app.delete("/bills/{bill_id}")
def delete_bill(bill_id: int, db: db_dependency):
    bill = db.query(models.Bill)\
             .filter(models.Bill.id == bill_id)\
             .first()

    if not bill:
        raise HTTPException(404, "Bill not found")

    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted successfully"}


@app.get("/bills/status", response_model=List[BillResponse])
def update_and_get_bill_status(user_id: int, db: db_dependency):
    today = date.today()

    bills = db.query(models.Bill)\
              .filter(models.Bill.user_id == user_id)\
              .all()

    for bill in bills:
        status: str = cast(str, bill.status)
        due_date: date = cast(date, bill.due_date)
        if status != "paid" and due_date < today:
            setattr(bill, "status", "overdue")

    db.commit()
    return bills

# Week 5 logic for Rewards and Alerts would go here


@app.post("/rewards")
def create_reward(reward: RewardCreate, db: db_dependency):
    new_reward = models.Reward(
        user_id=reward.user_id,
        program_name=reward.program_name,
        points_balance=reward.points_balance,
        last_updated=datetime.utcnow()
    )
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    return new_reward



@app.get("/rewards/summary")
def rewards_summary(user_id: int, db: db_dependency):
    rewards = db.query(models.Reward)\
                .filter(models.Reward.user_id == user_id)\
                .all()

    total_points = sum(r.points_balance for r in rewards)

    return {
        "total_programs": len(rewards),
        "total_points": total_points,
        "programs": rewards
    }


CURRENCY_RATES = {
    "USD": 1.0,
    "INR": 83.0,
    "EUR": 0.92,
    "GBP": 0.78
}

@app.get("/rewards/currency-summary")
def currency_summary(user_id: int, db: db_dependency):
    transactions = (
        db.query(models.Transaction)
        .join(models.Account)
        .filter(models.Account.user_id == user_id)
        .all()
    )

    totals_by_currency = defaultdict(float)
    total_usd = 0.0

    for txn in transactions:
        currency: str = cast(str, txn.currency)
        amount = float(cast(Decimal, txn.amount))
        

        totals_by_currency[currency] += amount

        # Convert to USD using static rates
        rate = CURRENCY_RATES.get(currency, 1.0)
        usd_value = amount / rate
        total_usd += usd_value

    return {
        "by_currency": totals_by_currency,
        "total_in_usd": round(total_usd, 2)
    }

@app.get("/insights/cashflow")
def cashflow(user_id: int, db: db_dependency):
    # Join accounts -> transactions to get only this user's txns
    income = db.query(func.sum(models.Transaction.amount))\
        .join(models.Account)\
        .filter(models.Account.user_id == user_id)\
        .filter(models.Transaction.txn_type == "credit")\
        .scalar() or 0

    expense = db.query(func.sum(models.Transaction.amount))\
        .join(models.Account)\
        .filter(models.Account.user_id == user_id)\
        .filter(models.Transaction.txn_type == "debit")\
        .scalar() or 0

    return {
        "income": float(income),
        "expense": float(expense),
        "net": float(income - expense)
    }

@app.get("/insights/top-merchants")
def top_merchants(user_id: int, db: db_dependency, limit: int = 5):
    results = (
        db.query(
            models.Transaction.merchant,
            func.sum(models.Transaction.amount).label("total_spent")
        )
        .join(models.Account)
        .filter(models.Account.user_id == user_id)
        .filter(models.Transaction.txn_type == "debit")
        .group_by(models.Transaction.merchant)
        .order_by(func.sum(models.Transaction.amount).desc())
        .limit(limit)
        .all()
    )

    return [
        {"merchant": r[0], "total_spent": float(r[1])}
        for r in results
    ]


@app.get("/insights/burn-rate")
def burn_rate(user_id: int, db: db_dependency):
    today = date.today()
    start_month = date(today.year, today.month, 1)

    total_spent = db.query(func.sum(models.Transaction.amount))\
        .join(models.Account)\
        .filter(models.Account.user_id == user_id)\
        .filter(models.Transaction.txn_type == "debit")\
        .filter(models.Transaction.txn_date >= start_month)\
        .scalar() or 0

    days_passed = today.day

    daily_burn = float(total_spent) / max(days_passed, 1)

    return {
        "month": today.month,
        "total_spent": float(total_spent),
        "daily_burn_rate": round(daily_burn, 2)
    }


@app.get("/alerts")
def get_alerts(user_id: int, db: db_dependency):
    alerts = db.query(models.Alert)\
        .filter(models.Alert.user_id == user_id)\
        .order_by(models.Alert.created_at.desc())\
        .all()

    return alerts


@app.post("/alerts/check-low-balance")
def check_low_balance(user_id: int, db: db_dependency, threshold: float = 1000):
    accounts = db.query(models.Account)\
        .filter(models.Account.user_id == user_id)\
        .all()

    created = []

    for acc in accounts:
        if cast(float,acc.balance) < threshold:
            alert = models.Alert(
                user_id=user_id,
                type="low_balance",
                message=f"Low balance in {acc.bank_name} account: {acc.balance}",
            )
            db.add(alert)
            created.append(alert)

    db.commit()
    return {"alerts_created": len(created)}


@app.post("/alerts/check-budgets")
def check_budget_alerts(user_id: int, db: db_dependency):
    budgets = db.query(models.Budget)\
        .filter(models.Budget.user_id == user_id)\
        .all()

    created = []

    for b in budgets:
        if cast(float,b.spent_amount) > cast(float,b.limit_amount):
            alert = models.Alert(
                user_id=user_id,
                type="budget_exceeded",
                message=f"Budget exceeded for {b.category} ({b.month}/{b.year})",
            )
            db.add(alert)
            created.append(alert)

    db.commit()
    return {"alerts_created": len(created)}