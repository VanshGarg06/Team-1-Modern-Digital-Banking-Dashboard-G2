# Team-1-Modern-Digital-Banking-Dashboard-G2
## Description of Modern Digital Banking Dashboard
We are building a personal digital banking dashboard, like what users see in
modern banking or finance applications.
A user should be able to:
- Log in securely
- Add multiple bank accounts
- View transactions
- Categorize spending
- Set budgets
- Track bills
- View rewards
- Receive alerts
- See financial insights
This is not a toy project. It mirrors real-world systems used in fintech products.
## FastAPI Endpoints
- GET /
- GET /accounts/ 
- POST /accounts/
- GET /accounts/{accountid}
- PUT /accounts/{accountid}
- DELETE /accounts/{accountid}
- GET /categories/
- POST /transactions/auto-categorize
- PUT /transactions/{transaction_id}/category
- POST /budgets/
- GET /budgets/progress
- POST /bills
- GET /bills
- PUT /bills/{bill_id}
- DELETE /bills/{bill_id}
- GET /bills/status
- POST /rewards
- GET /rewards/summary
- GET /rewards/currency-summary
- GET /insights/cashflow
- GET /insights/top-merchants
- GET /insights/burn-rate/
- GET /alerts
- POST /alerts/check-low-balance
- POST /alerts/check-budgets

## ER Diagram of Database 
<img width="1950" height="1648" alt="ER diagram Infosys" src="https://github.com/user-attachments/assets/83d3d3f7-e3b6-4049-afb6-79965ba79c98" />

## Frontend 
This resides in VanshDatabaseAPI branch made by @VanshGarg06 under banking-app which we can start by changing the directory by:
```
cd banking-app
npm install
npm run dev
```
Open your browser at ``` http://localhost:5173 ``` and you're live.

### Glimpse of Frontend
<img width="1920" height="930" alt="image" src="https://github.com/user-attachments/assets/1ddf8070-e4cb-47f5-9c84-bbb3b3bae339" />
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/94d928c6-e57e-4ef1-a426-f71adfcdfb9e" />
<img width="1920" height="925" alt="image" src="https://github.com/user-attachments/assets/34a450a5-a434-4b93-97f3-433ee82a9c50" />
<img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/d56ecd50-f605-4771-8187-51d61b6c4a79" />
<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/7c38bf7d-ea89-4902-84fa-1d5ab149725e" />
<img width="1920" height="904" alt="image" src="https://github.com/user-attachments/assets/44c356f0-d509-4ff3-a1d0-cedd2811bdaa" />
<img width="1920" height="920" alt="image" src="https://github.com/user-attachments/assets/a850a48f-9259-4550-a67e-3de0f85ffe8f" />

#### Demo Login details are as follows:
- ID : ```   demo@bank.com  ```
- Password : ``` demo123  ```

<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/bbf4144a-2e35-4119-ab12-3813991d08ee" />


# Made and Contributed by Vansh Garg 






