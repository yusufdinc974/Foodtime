# 📚 FOOD TIME Database Guide

## How the Database Works

### Database Type: SQLite
- **Location**: `foodtime-backend/foodtime.db`
- **Type**: File-based SQL database (no server needed)
- **Size**: Currently ~36KB

### Database Tables

When you sign up or the backend starts, these 3 tables are created:

1. **`users`** - User accounts and profiles
   - `id` - Unique user ID (auto-increment)
   - `email` - User's email (unique, used for login)
   - `hashed_password` - Encrypted password (bcrypt)
   - `name` - User's display name
   - `is_active` - Account status (1 = active)
   - `weight`, `height`, `gender`, `job`, `goal` - Profile data
   - `created_at`, `updated_at` - Timestamps

2. **`meals`** - Daily meal entries
   - `id` - Unique meal ID
   - `user_id` - Links to users table (foreign key)
   - `meal_date` - Date of the meal
   - `morning_meal`, `morning_feeling` - Breakfast
   - `afternoon_meal`, `afternoon_feeling` - Lunch
   - `evening_meal`, `evening_feeling` - Dinner
   - `created_at`, `updated_at` - Timestamps

3. **`food_analyses`** - AI analysis results
   - `id` - Unique analysis ID
   - `meal_id` - Links to meals table (foreign key)
   - `analysis_type` - Type: 'daily', 'food_query', 'photo'
   - `analysis_result` - AI's response text
   - `health_score` - Health rating (0-10)
   - `created_at` - Timestamp

### How Signup Works

1. **User fills signup form**: email, password, name
2. **Frontend sends to**: `POST /api/auth/signup`
3. **Backend checks**: Email not already registered
4. **Backend creates**: 
   - Hashes password with bcrypt
   - Creates new row in `users` table
   - Generates JWT token
5. **Backend returns**: JWT token
6. **Frontend stores**: Token in localStorage
7. **All future requests**: Include token in header

### Data Isolation

- Each user's data is **completely separate**
- When you make API calls, the backend:
  1. Reads JWT token from request header
  2. Extracts user ID from token
  3. Only returns/modifies data for that user ID
- Example: `GET /api/meals/history` only returns YOUR meals

### Viewing the Database

To see what's in your database:

```bash
cd foodtime-backend
sqlite3 foodtime.db
```

Then run SQL commands:
```sql
-- See all tables
.tables

-- See all users
SELECT id, email, name FROM users;

-- See all meals for user 1
SELECT * FROM meals WHERE user_id = 1;

-- Count users
SELECT COUNT(*) FROM users;

-- Exit
.quit
```

### Common Issues

**"Email already registered"**:
- The email exists in the database
- Try a different email OR delete the database and restart

**500 Internal Server Error**:
- Tables might not exist
- Run: `cd foodtime-backend && ./venv/bin/python -c "from app.database import *; from app.models import *; Base.metadata.create_all(bind=engine)"`

**Database locked**:
- Backend or another process is using it
- Restart the backend server

### Resetting the Database

To start fresh:
```bash
cd foodtime-backend
rm foodtime.db
# Restart backend - it will recreate the database
./start.sh
```

---

## Current Status

Your database file exists at: `foodtime-backend/foodtime.db` (36KB)

If you're getting errors, it might be because:
1. Tables weren't created on first startup
2. Database is locked
3. Permission issues

I can help you fix any of these! Just let me know what error you're seeing.
