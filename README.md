🚧 **STATUS: UNDER DEVELOPMENT** 🚧

# 📈 DualTrader – Trade Both Sides with Ease

**DualTrader** is a lightweight PWA (Progressive Web App) that enables traders to **buy and sell the same equity/futures/options simultaneously** using **two separate Kite (Zerodha) accounts** — one for buying and one for selling. This makes it possible to execute more advanced strategies like **straddles, strangles, hedges, or volatility-based trades** which are **not possible using a single broker account due to restrictions**.

---

## 🚀 Why DualTrader?

Traditional brokers restrict users from placing simultaneous buy and sell orders for the same security under the same account. This limits traders who wish to:

- **Create delta-neutral or volatility strategies**
- **Simultaneously hedge their positions**
- **Test opposing market predictions (e.g., breakout vs. breakdown)**

**DualTrader** provides a solution by allowing users to log in with **two separate Kite accounts** (e.g., personal and family/friend account) and seamlessly trade both sides of the same instrument.

---

## 🛠️ Tech Stack

- **UI Flow (Using Excelidraw.com)** 
[Download Guide](https://raw.githubusercontent.com/harshgupta20/dual-trader/main/dual-trader-ui-flow.excalidraw)


- **Frontend**: React + Vite + Tailwind CSS
- **PWA**: Installable on mobile and desktop
- **Backend/DB**: Firebase (Firestore/Realtime DB + Auth)
- **API Integration**: [Kite Connect API](https://kite.trade/)
- **Hosting**: Fully self-hostable on GitHub Pages, Vercel, Firebase, or your own server

---

## 🔐 Features

- ✅ Login with 2 different Zerodha (Kite) accounts
- ✅ Place **BUY** from one account and **SELL** from another
- ✅ View live PnL from both accounts
- ✅ Firebase used to store session info, trade logs, user preferences
- ✅ Mobile-first responsive PWA
- ✅ Logout, refresh tokens, and session security
- ✅ Works for **Equities**, **Futures**, and **Options**

---

## 📸 Screenshots

_Coming Soon_

---

## 🚧 Project Status

> 🛠️ Currently in development  
> 🔜 MVP shipping soon  
> 📬 Contributions & feedback are welcome!

---

## 📦 How to Self-Host

### 1. Clone the repository
```bash
git clone https://github.com/your-username/dualtrader.git
cd dualtrader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file with:
```env
VITE_KITE_API_KEY=your_kite_api_key
VITE_KITE_REDIRECT_URI=http://localhost:5173/callback
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
```

> You'll need to create a Kite developer app from [Kite Developer Console](https://developers.kite.trade/apps) and set up Firebase from [Firebase Console](https://console.firebase.google.com/).

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

Then deploy the `dist/` folder to your preferred hosting platform.

---

## 🤝 Disclaimer

This software is **not affiliated with Zerodha or any brokerage firm** in any way.

**This tool is for educational and experimental purposes only.**  
By using this project, you acknowledge that:

- You are solely responsible for how you use this code and application.
- You must comply with all trading regulations and brokerage terms.
- The developer is **not liable** for any loss, damage, legal consequence, or violation resulting from usage of this tool.
- **Do NOT use this for actual trading unless you fully understand the legal and financial risks.**

Use at your own risk.

---

## 📧 Contact / Feedback

Have suggestions or want to contribute?

- Raise an issue or PR on GitHub
- [Your email/contact link]

---

## ⭐ Star This Project

If you find this useful, give it a ⭐ on GitHub to support the project!
