# FOOD TIME

AI-powered nutrition tracking application built with React and FastAPI.

## 🚀 Quick Start

### Local Development

**Backend:**
```bash
cd foodtime-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd foodtime-frontend
npm install
npm run dev
```

Visit: http://localhost:5173

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- Backend: [Railway](https://railway.app) - $5/month
- Frontend: [Vercel](https://vercel.com) - Free

## 🎯 Features

- 🤖 AI-powered meal analysis (Google Gemini)
- 📊 Nutrition tracking (calories, protein, carbs, fat)
- 📸 Photo analysis
- 📈 Weekly reports with insights
- 🎨 Fenerbahçe-themed UI
- 📱 Mobile responsive

## 🛠 Tech Stack

**Frontend:**
- React + Vite
- Recharts for visualizations
- Axios for API calls

**Backend:**
- Python FastAPI
- SQLAlchemy ORM
- PostgreSQL/SQLite
- Google Gemini AI

## 📝 Environment Variables

**Backend (.env):**
```env
DATABASE_URL=sqlite:///./foodtime.db
GEMINI_API_KEY=your_key
SECRET_KEY=your_secret
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [How to Run](./HOW_TO_RUN.md)
- [Database Guide](./DATABASE_GUIDE.md)
- [Quickstart](./QUICKSTART.md)

## 📄 License

MIT

## 👤 Author

Built with ❤️ using Google Gemini AI
