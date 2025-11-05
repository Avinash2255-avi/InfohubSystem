InfoHub

A small single-page app that shows:

✅ Weather information

✅ Currency conversion (INR → USD/EUR)

✅ Motivational quotes

Built with React (Frontend) + Node/Express (Backend).

How to run
1️⃣ Start backend
cd server
npm install
copy .env.example .env   # Add your OpenWeather key in .env
npm run dev


Backend runs on: http://localhost:3001

2️⃣ Start frontend
cd ../client
npm install
npm run dev


Frontend runs on: http://localhost:5173

API Endpoints

/api/weather?city=Mumbai,IN

/api/currency?amount=100

/api/quote