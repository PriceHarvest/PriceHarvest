# 🌾 PriceHarvest — Crop Price Analysis & Trend Identification

**BTech Mini Project | Data Science | SNDT Women's University**
**Final Phase: EDA, 30-day ML Forecasting, Live Mandi Prices, AI Chatbot, Prediction Page & Tableau Dashboard**

---

## 👥 Team

| Name | Roll No | Contribution |
|---|---|---|
| Sakshi Jagdish Patil | 51 | Data preprocessing, EDA, seasonal trend analysis |
| Purva Atul Pawar | 54 | Dashboard development, interactive visualizations |
| Siddhi Jagdish Shinde | 68 | Website design, documentation, time-series analysis |

---

## ✨ What the Website Does

| Page | Files | What it shows |
|---|---|---|
| **Home** | `index.html`, `script.js`, `style.css` | Project overview, dataset, EDA charts for the 25 city–crop series, insights, ML snapshot, language switcher and the AI chatbot |
| **ML Insights** | `ml.html` | Models, result tables, per-series model selection, leakage fixes, features, limitations |
| **Predict** | `predict.html`, `predict.js`, `forecasts.js` | Choose city + crop → 30-day forecast with p10–p90 band, model badge, MAPE, CSV download |
| **Live Mandi** | `mandi.html`, `mandi.js`, `server.py` | Today's real Min / Max / Modal prices from Agmarknet (data.gov.in) for 5 cities × 5 crops |
| **Tableau** | `tableau.html`, `tableau-config.js` | Embedded Tableau dashboard |
| **AI Chatbot** | inside `index.html` | Gemini-powered assistant that falls back to built-in answers when the API is unavailable |

**Languages:** English, Hindi and Marathi (switch from the **EN** menu in the top bar).

---

## 📁 Project Structure

```
PriceHarvest/
├── index.html               ← Home page (also contains the chatbot)
├── ml.html                  ← ML Insights page
├── predict.html / predict.js← 30-day forecast page
├── forecasts.js             ← Forecast data for the Predict page (generated, see below)
├── mandi.html / mandi.js    ← Live Mandi prices page
├── tableau.html             ← Embedded Tableau dashboard
├── tableau-config.js        ← Paste your Tableau view URL here
├── script.js / style.css    ← Site behaviour and styling
├── server.py                ← Local server: serves the site + /api/mandi proxy (keeps key private)
│
├── chat-config.example.js   ← Template for the chatbot key (safe to share)
├── chat-config.js           ← YOUR chatbot key (git-ignored, never upload)
├── .env.example             ← Template for the data.gov.in key (safe to share)
├── .env                     ← YOUR data.gov.in key (git-ignored, never upload)
├── .gitignore
│
├── data/                    ← Phase-1 raw CSV datasets (from Agmarknet)
├── src/                     ← Phase-1 Python modules (preprocessing, EDA, time series, insights)
├── eda/eda_analysis.ipynb   ← Jupyter notebook with the EDA steps
├── dashboard/app.py         ← Phase-1 Streamlit dashboard
├── tools/export_forecasts.py← Creates forecasts.js from the Phase-3 notebook
├── images/                  ← EDA and ML chart images used on the website
├── bi_images/               ← Dashboard screenshots
├── outputs/insights/        ← Intelligence reports (JSON + TXT)
│
├── main.py                  ← Phase-1 pipeline runner
├── requirements.txt         ← Python dependencies for the analysis scripts
└── README.md                ← This file
```

---

## 🚀 Quick Start (VS Code)

### 1. Run the website with Live Mandi

```bash
# Inside the project folder (the one that contains index.html)
python server.py
```

Open **http://localhost:8000** in your browser. `server.py` needs no extra installs.

> Open the site through `localhost:8000`, **not** with VS Code Live Server (port 5500) and not as a `file://` page.
> Live Server only serves static files, so the Live Mandi page cannot get data from it.

### 2. Add your API keys (one-time)

Keys are never stored in the code. Copy the example files and fill them in:

| Feature | Copy this | To this | What to put in it |
|---|---|---|---|
| Live Mandi prices | `.env.example` | `.env` | `DATA_GOV_API_KEY=your_key` (free at https://data.gov.in → My Account → API Key) |
| Gemini chatbot (optional) | `chat-config.example.js` | `chat-config.js` | `window.CHAT_KEY = "your_gemini_key";` (free at https://aistudio.google.com) |

Both real files are listed in `.gitignore` and are never uploaded to GitHub.
Without them the site still works: Live Mandi shows a setup message and the chatbot uses its built-in answers.

### 3. Run the Phase-1 analysis (optional)

```bash
pip install -r requirements.txt
python main.py                          # regenerates charts and the insights report
jupyter notebook eda/eda_analysis.ipynb # EDA notebook
streamlit run dashboard/app.py          # Phase-1 interactive dashboard (http://localhost:8501)
```

---

## 🤖 PriceHarvest AI Chatbot

The chat bubble (bottom-right of the Home page) answers questions about crop prices, forecasts, the Predict page, the Tableau dashboard and live mandi prices, in English, Hindi and Marathi.

**How it answers**
1. **Instant built-in answers** for common questions (the five crops, forecasts and accuracy, Tableau, Live Mandi, the dataset, best months to sell, greetings, thanks and goodbyes). It tolerates typos, for example "tabelu" or "onoin".
2. **Gemini API** for anything the built-in answers don't cover (for example general questions).
3. **Automatic fallback:** if the API key is missing, the quota is used up, the request times out or there is no internet, the bot quietly uses the built-in answers, so it never breaks.

**Settings** (the `CHAT_API` block near the top of the chatbot script in `index.html`)

| Setting | Meaning |
|---|---|
| `url` | Gemini endpoint, currently `.../models/gemini-flash-lite-latest:generateContent` |
| `key` | Read from `chat-config.js` (`window.CHAT_KEY`) |
| `timeoutMs` | How long to wait for Gemini before falling back (`15000` = 15 s) |
| `localFirst` | `true` = answer known questions instantly and only call Gemini for the rest (saves free quota). `false` = always ask Gemini first |

**Debugging:** press F12 → Console and look for lines starting with `[PriceHarvest chat]`. They show whether the API answered or why it fell back (HTTP 400/403 = bad key, 404 = wrong model name, 429 = free quota used up).

---

## 🌐 Live Mandi Prices (`mandi.html`)

Shows today's real Min / Max / Modal prices (₹ per quintal) from Agmarknet for 5 cities × 5 crops:
Mumbai, Nashik, Nagpur, Kolhapur, Ratnagiri × Onion, Tomato, Potato, Spinach, Cabbage.

**How it works:** the browser calls `/api/mandi` on `server.py`, which fetches the Government of India Open Data Portal dataset and keeps your API key on the server. Results are cached for 15 minutes.

If you see *"Server did not return JSON"*, you opened the page from the wrong address. Run `python server.py` and open `http://localhost:8000/mandi.html`.
If a city/crop shows *"No records found"*, today's data may not have been uploaded to Agmarknet yet.

---

## 🔮 Forecasts and Tableau

- **Daily forecasts:** run `tools/export_forecasts.py` as the last cell of the Phase-3 notebook, then place the generated `forecasts.js` next to `predict.html`. The Predict page needs this file. It contains no secrets, so commit it to the repo.
- **Tableau:** paste your Tableau Public view URL into `tableau-config.js`.

**Headline results** (recursive 30-day forecast):

| Result | Value |
|---|---|
| Best single model | Global Cross-Series LightGBM, validation MAPE **17.81%** |
| Selected models, test MAPE | **22.38%** vs 26.97% for the Last-7-Day Median baseline |
| Series where ML beat the baseline | 17 of 25 |
| Series | 25 = 19 government + 6 synthetic |

---

## 📊 Dataset

**Source:** [Agmarknet Portal, Government of India](https://agmarknet.gov.in)

| Field | Description |
|---|---|
| `Arrival_Date` | Date of price record at market |
| `State` | State of the market |
| `District` / `Market` | District and APMC / Mandi name |
| `Commodity` | Crop name |
| `Min_Price` / `Max_Price` / `Modal_Price` | Price range and most common price (₹/Quintal) |

| | Phase 1 (`data/`) | Final phase (website) |
|---|---|---|
| Crops | Wheat, Tomato, Onion | Onion, Tomato, Potato, Spinach, Cabbage |
| Places | Haryana, Mumbai | Mumbai, Nashik, Nagpur, Kolhapur, Ratnagiri |
| Period | Jan 2023 – Dec 2025 | Jan 2021 – Jun 2026 |
| Size | 7,497 records | about 80,587 cleaned records, 25 city–crop series |

---

## 💡 Key Findings (Phase 1)

| Finding | Detail |
|---|---|
| **Most Volatile Crop** | Tomato (CV = 71.8% in Mumbai) |
| **Most Stable Crop** | Wheat (CV = 5.4% in Mumbai) |
| **Biggest Regional Gap** | Wheat 84% costlier in Mumbai vs Haryana |
| **Best Month for Onion** | November (post-Kharif peak) |
| **Tomato Peaks** | July–August (monsoon disruptions) |
| **Highest Price Ever** | ₹120/kg Tomato at Gharaunda — Jul 2023 |
| **Price Correlation** | Min ↔ Modal price: r = 0.94 |

---

## 🛠️ Tools & Technologies

- **Python 3.10+**: core programming; `server.py` uses only the standard library
- **Pandas & NumPy**: data manipulation
- **LightGBM & XGBoost**: 30-day price forecasting
- **Matplotlib, Seaborn & Plotly**: visualizations
- **Streamlit**: Phase-1 interactive dashboard
- **Tableau**: final dashboard
- **HTML, CSS & JavaScript**: website, Predict page and chatbot
- **Google Gemini API**: chatbot replies (free tier, with built-in fallback)
- **Government of India Open Data API (data.gov.in)**: live mandi prices
- **Google Translate widget**: English / Hindi / Marathi
- **Jupyter Notebook & VS Code**: development

---

## 🔐 Keys and Security

- Real keys live only in `.env` and `chat-config.js`. Both are in `.gitignore`.
- Only `.env.example` and `chat-config.example.js` (placeholders) are uploaded.
- Before every commit run `git status` and make sure `.env` and `chat-config.js` are **not** listed.
- If a key is ever pushed by mistake, deleting the file is not enough. Delete that key at its provider and create a new one.
- The chatbot key is used in the browser, so anyone running your copy of the site can see it. For a public deployment, move the Gemini call into `server.py` the way the mandi proxy works.

---

## 📤 Publishing on GitHub

```bash
git init
git check-ignore -v .env chat-config.js   # both must be listed
git add .
git status                                # .env and chat-config.js must NOT appear
git commit -m "PriceHarvest final version"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

GitHub Pages can host the static pages, but the chatbot (Gemini) and Live Mandi need your keys and `server.py`, so on Pages the chatbot only uses its built-in answers and Live Mandi will not load.

---

## 🗺️ Phase Roadmap

### ✅ Phase 1
- [x] Data preprocessing & cleaning
- [x] Feature engineering (rolling stats, volatility index)
- [x] Individual crop EDA (6 chart types per dataset)
- [x] State comparison analysis
- [x] Time-series decomposition & forecasting
- [x] Price intelligence insights engine
- [x] Streamlit interactive dashboard
- [x] Professional project website

### ✅ Final Phase
- [x] More data added for better evaluation (25 city–crop series)
- [x] 30-day ML forecasting with Predict page
- [x] Tableau dashboard integration
- [x] Multi-language support (English, Hindi, Marathi)
- [x] AI chatbot for user guidance (Gemini + built-in fallback)
- [x] Live Mandi prices from Agmarknet via data.gov.in

### 🔜 Future Work
- [ ] Move the chatbot call to the server so no key is exposed in the browser
- [ ] Automatic daily refresh of forecasts
- [ ] More crops and states
- [ ] Mobile-friendly app version

---

## 📄 References

- Agmarknet Portal, Government of India — https://agmarknet.gov.in
- Open Government Data Platform India — https://data.gov.in
- Ministry of Agriculture & Farmers Welfare, Government of India
- Google AI Studio / Gemini API — https://aistudio.google.com
- Streamlit Documentation — https://docs.streamlit.io
- Scikit-learn Documentation — https://scikit-learn.org

---

*Department of Data Science and Engineering | Usha Mittal Institute of Technology | SNDT Women's University | Academic Year 2026–27*
