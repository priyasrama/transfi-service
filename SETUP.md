# TransFi Service - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## MongoDB Setup

### Option 1: Local MongoDB
If you have MongoDB installed locally:
```bash
# Start MongoDB (if not already running)
brew services start mongodb-community@7.0
# or
mongod --config /opt/homebrew/etc/mongod.conf
```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string (mongodb+srv://...)
4. Update `MONGO_URI` in `backend/.env`

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   The `.env` file has been created with default values. Update it if needed:
   ```bash
   # Edit backend/.env
   PORT=5050
   MONGO_URI=mongodb://127.0.0.1:27017/transfi  # or your Atlas URI
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars
   HMAC_SECRET=your-hmac-secret-for-payment-webhooks-min-32-chars
   ENCRYPTION_KEY=0123456789abcdef0123456789abcdef
   ```

4. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   You should see:
   - `✅ MongoDB Connected: ...`
   - `✅ Server running on port 5000`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Optional - Configure API URL:**
   Create `frontend/.env` if you need to change the API URL:
   ```bash
   REACT_APP_API_URL=http://localhost:5050/api
   ```

4. **Start the frontend:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Running Both Services

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## Verify Installation

1. **Backend API:**
   ```bash
   curl http://localhost:5050/
   # Should return: 🚀 Mini Payment Gateway API is running
   ```

2. **Frontend:**
   - Open `http://localhost:3000` in your browser
   - Check browser console for any errors

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `pgrep -x mongod`
- Check MongoDB logs if connection fails
- For Atlas: Ensure your IP is whitelisted in Network Access

### Port Already in Use
- Change `PORT` in `backend/.env` if 5000 is taken
- Update `REACT_APP_API_URL` in frontend if backend port changes

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL exactly
- Check browser console for specific CORS error messages

## Environment Variables Reference

### Backend (.env)
- `PORT`: Backend server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `JWT_SECRET`: Secret for JWT access tokens
- `REFRESH_SECRET`: Secret for JWT refresh tokens
- `HMAC_SECRET`: Secret for HMAC webhook verification
- `ENCRYPTION_KEY`: 32-byte hex key for data encryption

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API base URL (default: http://localhost:5050/api)

