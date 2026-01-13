# FOOD TIME - Quick Start Guide

## ✅ What's Already Done

- ✅ Python virtual environment created (`foodtime-backend/venv`)
- ✅ All backend dependencies installed (FastAPI, SQLAlchemy, Gemini AI, etc.)
- ✅ All frontend dependencies installed (React, Vite, Axios, etc.)

## 🔧 Next Steps: Database Setup

### Option 1: Using MySQL (Recommended)

1. **Install MySQL** (if not installed):
   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   ```

2. **Create Database and User**:
   ```bash
   sudo mysql
   ```
   
   Then run these SQL commands:
   ```sql
   CREATE DATABASE foodtime;
   CREATE USER 'foodtime_user'@'localhost' IDENTIFIED BY 'foodtime123';
   GRANT ALL PRIVILEGES ON foodtime.* TO 'foodtime_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Create Backend .env File**:
   ```bash
   cd /home/sicakahve/Desktop/furkan/foodtime-backend
   cp .env.example .env
   ```
   
   Edit the `.env` file with your favorite editor:
   ```bash
   nano .env  # or use vim, gedit, code, etc.
   ```
   
   Make sure it contains:
   ```env
   DATABASE_URL=mysql+pymysql://foodtime_user:foodtime123@localhost/foodtime
   GEMINI_API_KEY=AIzaSyBEBxOdpfy4bmdBf3CPkFGhwjj1jzLxj08
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DEBUG=True
   BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
   ```

### Option 2: Using SQLite (Easier, No MySQL Needed)

If you prefer not to install MySQL, you can use SQLite:

1. **Update the database URL** in your `.env` file:
   ```env
   DATABASE_URL=sqlite:///./foodtime.db
   ```

2. **Modify database.py** to use SQLite-specific options (I can help with this)

## 🚀 Running the Application

### Start Backend (Terminal 1)

```bash
cd /home/sicakahve/Desktop/furkan/foodtime-backend
source venv/bin/activate
uvicorn app.main:app --reload
```

✅ Backend will run on: `http://localhost:8000`  
📚 API Docs available at: `http://localhost:8000/docs`

### Start Frontend (Terminal 2)

```bash
cd /home/sicakahve/Desktop/furkan/foodtime-frontend
npm run dev
```

✅ Frontend will run on: `http://localhost:5173`

## 🧪 Testing the Application

1. **Open your browser** to `http://localhost:5173`
2. **Click "SİSTEMİ BAŞLAT"** on the welcome screen
3. **Click the profile icon** (👤) in the header
4. **Fill in your profile information** and click "GÜNCELLE"
5. **Try the Daily Analysis** tab:
   - Enter meals for morning, afternoon, and evening
   - Click "ANALİZ ET VE RAPORLA"
6. **Try Food Query** tab:
   - Enter a food item (e.g., "Izgara tavuk")
   - Click "SORGULA"
7. **Try Photo Analysis** tab:
   - Click to upload a food photo
   - Click "TARA"

## 🔍 Troubleshooting

### Backend won't start:
- Check if MySQL is running: `sudo systemctl status mysql`
- Check if database exists: `mysql -u foodtime_user -p` then `SHOW DATABASES;`
- Check .env file exists and has correct values

### Frontend won't start:
- Make sure npm install completed without errors
- Try `npm install` again if needed  
- Check if port 5173 is available

### API calls fail:
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify .env BACKEND_CORS_ORIGINS includes the frontend URL

## 📝 Important Notes

- The original Gemini API key from your HTML file is pre-configured
- You may want to generate your own API key at: https://makersuite.google.com/app/apikey
- The application stores user data in the MySQL database
- Profile information is also cached in browser localStorage

## 🎯 What to do next?

Let me know if you:
1. Want to use MySQL (I can check if it's installed)
2. Want to use SQLite instead (easier setup)
3. Need help with database setup
4. Want to start the servers and test the application

I'm ready to help you get the application running!
