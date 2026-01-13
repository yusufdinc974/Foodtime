# 🚀 How to Run FOOD TIME - Quick Guide

## ✅ Everything is Ready!

I've configured SQLite for you - no database installation needed!

---

## 🎯 Running the Application (2 Terminals)

### Terminal 1: Start Backend

```bash
cd /home/sicakahve/Desktop/furkan/foodtime-backend
./start.sh
```

**Or manually:**
```bash
cd /home/sicakahve/Desktop/furkan/foodtime-backend
source venv/bin/activate
uvicorn app.main:app --reload
```

✅ Backend will start on: **http://localhost:8000**  
📚 API Docs available at: **http://localhost:8000/docs**

---

### Terminal 2: Start Frontend

```bash
cd /home/sicakahve/Desktop/furkan/foodtime-frontend
./start.sh
```

**Or manually:**
```bash
cd /home/sicakahve/Desktop/furkan/foodtime-frontend
npm run dev
```

✅ Frontend will start on: **http://localhost:5173**

---

## 🧪 Testing the Application

1. **Open Browser**: Go to `http://localhost:5173`

2. **Welcome Screen**: Click "SİSTEMİ BAŞLAT"

3. **Create Profile**:
   - Click profile icon (👤) in top right
   - Fill in: Name, Weight (kg), Height (cm), Gender, Job, Goal
   - Click "GÜNCELLE"

4. **Test Daily Analysis**:
   - Go to "GÜNLÜK ANALİZ" tab
   - Enter meals for:
     - SABAH (morning)
     - ÖĞLE (afternoon)
     - AKŞAM (evening)
   - Click "ANALİZ ET VE RAPORLA"
   - Watch the AI analysis appear on the right!

5. **Test Food Query**:
   - Go to "BESİN SORGU" tab
   - Type a food (e.g., "Izgara tavuk göğsü")
   - Click "SORGULA"
   - See health score and nutrition info!

6. **Test Photo Analysis**:
   - Go to "FOTO ANALİZ" tab
   - Click to upload a food photo
   - Click "TARA"
   - Get AI analysis of the food!

7. **View Meal History**:
   - In "GÜNLÜK ANALİZ" tab
   - Click "📅 10 Günlük Öğün Geçmişi"
   - See your meal history!

---

## 📁 What Was Created

- **SQLite Database**: `foodtime-backend/foodtime.db` (auto-created on first run)
- **Backend .env**: Configuration file with Gemini API key
- **Start Scripts**: `start.sh` in both backend and frontend folders

---

## 🔧 Troubleshooting

**Backend won't start:**
```bash
cd foodtime-backend
source venv/bin/activate
pip list | grep fastapi  # Should show fastapi
```

**Frontend won't start:**
```bash
cd foodtime-frontend
npm list react  # Should show react
```

**CORS errors in browser:**
- Make sure backend is running first
- Check backend console shows: "Application startup complete"

**Database errors:**
- Delete `foodtime.db` and restart backend (it will recreate tables)

---

## 🎨 Responsive Design Testing

Open browser DevTools (F12) and test:
- **Mobile**: 375px width
- **Tablet**: 768px width
- **Desktop**: 1920px width

---

## 🛑 Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

---

## 📊 What Happens on First Run

1. Backend creates SQLite database (`foodtime.db`)
2. Three tables are created automatically:
   - `users` - User profiles
   - `meals` - Daily meal entries
   - `food_analyses` - AI analysis results
3. Frontend connects to backend API
4. You can start using the app immediately!

---

**Ready to go! Open two terminals and run the commands above.** 🚀
