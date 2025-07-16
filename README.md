# NASA Dashboard App

A dynamic web app built with **React** (frontend) and **Node.js** (backend), both using **TypeScript**.  
The app fetches data from NASA's public APIs and displays it through an interactive dashboard using **Syncfusion** components.  
It also integrates **OpenAI** for translating content and generating interactive quizzes based on NASA data.

You can explore the app here:  
🔗 https://nasa.luiszurita.es

---
<details>
<summary>🧩 Technologies Used</summary>

**Frontend**
- React
- WebSocket
- Syncfusion
- Axios
- Highcharts
- i18n (i18next)
- Moment.js
- Zustand
- Parcel
- TypeScript

**Backend**
- Axios
- dotenv
- Express
- Moment.js
- OpenAI
- ws
- Nodemon
- TypeScript

</details>

---

<details>
<summary>⚙️ Installation</summary>

There are two modes to run the app: **development** and **production**.  
**Development mode is recommended** as it’s simpler to set up.

### Clone the repository:

```bash
git clone https://github.com/verza22/bounceInsights
```

---

### Run Backend (Dev Mode):

> ⚠️ You must create a `.env` file in the `backend` directory.  
> You can copy it from `.env.example` and fill in your NASA and OpenAI API keys.

```bash
cd backend
npm install
npm run dev
# This will start the API on http://localhost:3001
```

---

### Run Frontend (Dev Mode):

```bash
cd frontend
npm install
npm run dev
# This will start the app on http://localhost:1234
```

---

### Run in Production:

```bash
npm run build
```

⚠️ Additional configuration is needed for NGINX.  
If you plan to deploy in production, please open a GitHub issue or contact me.

</details>
---

## 🚀 How to Use

When you open the app, you'll see 7 default widgets in the language of your browser.

- To change the language: go to Options → Language.
- To adjust widget size/layout: go to Options → Layout and choose Small, Medium, or Large.
- Use the date range selector at the top to filter data.
- Press "Edit" to resize, move, add, or delete widgets.
- Press "Refresh" on a widget to reload its data.

---

## 🌐 Supported Languages

- English
- Spanish
- German
- French
- Italian
- Dutch
- Russian

---

## 🧱 Widgets Explained

### Astronomy Picture of the Day (APOD)
Shows NASA’s daily astronomy image with title, description, and date. Text is translated with OpenAI. Reacts to date selected via NEO or GST.

### Quiz
Generates a quiz (3 options, 1 correct) based on APOD using OpenAI. Reacts to NEO or GST selected date.

### Near Earth Object
Displays line chart of asteroids per day. Clicking a day updates APOD and Quiz widgets.

### Geomagnetic Storm
Displays bar chart of Kp index per day. Clicking a day updates APOD and Quiz widgets.

### Coronal Mass Ejection
Pie chart showing CME event distribution by solar region within selected date range.

### Mars Rover Photos
Displays photos taken by Mars rovers within selected date range.

### Mars Weather Service
Shows max/min temperature on Mars. Does not react to date changes.

---

I hope you enjoy this small project and take time to explore and learn about the cosmos.