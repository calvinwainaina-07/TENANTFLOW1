# 🏠 TenantFlow

TenantFlow is a simple and efficient web application designed to help landlords and tenants manage rental payments, track bills, and generate receipts — all in one place.

---

## 🚀 Features

- 🔐 **User Authentication (Login System)**  
  Secure login for tenants to access their dashboard.

- 💳 **Bill Tracking**  
  Track payment status for:
  - Rent  
  - Water  
  - Electricity  

- 🧾 **Receipt Generation**  
  Automatically generate a receipt after successful payment.

- 💾 **Local Storage Integration**  
  Saves payment and receipt data in the browser for persistence.

- 📱 **Responsive UI**  
  Clean and simple interface built for usability.

---

## 🛠️ Tech Stack

- **HTML5** – Structure  
- **CSS (Tailwind CSS)** – Styling  
- **JavaScript (Vanilla JS)** – Functionality  
- **Browser Local Storage** – Data persistence  

---

## ⚙️ How It Works

1. User logs into the system  
2. Dashboard displays available bills  
3. User marks bills as paid  
4. App stores payment status in local storage  
5. A receipt is generated and saved  

---

## 🧪 Example Data (Mock Database)

```javascript
let bills = {
  rent: false,
  water: false,
  electricity: false
};
