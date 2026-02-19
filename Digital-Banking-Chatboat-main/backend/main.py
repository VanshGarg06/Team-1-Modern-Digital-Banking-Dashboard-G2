from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Table
from reportlab.lib.styles import getSampleStyleSheet
import os


app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Serve your finhealth-main frontend (calculators, html, css, js)
# import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

frontend_path = os.path.join(BASE_DIR, "finhealth-main")

app.mount("/static", StaticFiles(directory=frontend_path), name="static")




# --------------------------
# Chat API
# --------------------------

class Message(BaseModel):
    message: str


@app.post("/chat")
def chat(msg: Message):
    user_msg = msg.message.lower()

    # ---------- Calculator redirects ----------

    if "sip" in user_msg:
        return {
        "reply": "📈 Opening SIP calculator...",
        "redirect": "/static/calculators/sip.html"
    }


    if "home loan" in user_msg:
        return {
            "reply": "🏠 Opening Home Loan calculator...",
            "redirect": "/static/calculators/home-loan.html"

        }

    if "car loan" in user_msg or "car" in user_msg:
        return {
            "reply": "🚗 Opening Car Loan calculator...",
            "redirect": "/calculators/car.html"
        }

    # ---------- Banking replies ----------

    if any(w in user_msg for w in ["hi", "hello", "hey"]):
        return {"reply": "Hello 👋 Welcome to Enterprise AI Banking System!"}

    elif "balance" in user_msg:
        return {"reply": "Your current balance is ₹2,45,000"}

    elif "loan" in user_msg:
        return {
            "reply": "🏦 We offer Home, Car & Personal loans. Ask which one you want."
        }

    elif "emi" in user_msg:
        return {
            "reply": "📊 EMI Example: ₹5L for 5 years @9% ≈ ₹10,377/month"
        }

    elif "credit card" in user_msg:
        return {
            "reply": "💳 Platinum Credit Card with cashback & lounge access"
        }

    elif "debit card" in user_msg or "card" in user_msg:
        return {
            "reply": "🏧 Debit Card with zero annual charges"
        }

    elif "atm" in user_msg:
        return {"reply": "Nearest ATM available within 500 meters."}

    elif "upi" in user_msg:
        return {"reply": "📲 Your UPI ID: user@bankai"}

    elif "fd" in user_msg:
        return {"reply": "FD Rates: 1Y 6.5% | 3Y 7% | 5Y 7.5%"}

    elif "rd" in user_msg:
        return {"reply": "RD starts from ₹1,000/month upto 7% interest."}

    elif "kyc" in user_msg:
        return {"reply": "KYC needs Aadhaar + PAN + Selfie"}

    elif "fraud" in user_msg:
        return {"reply": "🚨 Call 1800-000-999 and block card"}

    else:
        return {"reply": "Ask me about SIP, loans, EMI, cards, UPI, etc."}

@app.post("/generate-pdf")
def generate_pdf(data: dict):

    filename = "calculator_report.pdf"
    file_path = os.path.join(os.getcwd(), filename)

    doc = SimpleDocTemplate(file_path)
    elements = []

    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph("<b>Bank AI Calculator Report</b>", styles["Title"]))
    elements.append(Spacer(1, 20))

    # Table Data
    table_data = [["Field", "Value"]]

    for key, value in data.items():
        table_data.append([str(key), str(value)])

    table = Table(table_data)
    elements.append(table)

    # Build PDF
    doc.build(elements)

    # Return proper PDF response
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="SIP_Report.pdf"
    )
