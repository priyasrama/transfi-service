# transfi-service

This repository contains the backend and frontend code for the Transfi Service (payment-service) project.

## Structure

- `frontend/` &mdash; React frontend application
- `backend/` &mdash; Backend service

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/transfi-service.git
   cd transfi-service
   ```

2. **Install dependencies:**
   - For backend:  
     ```bash
     cd backend
     npm install
     ```
   - For frontend:  
     ```bash
     cd ../frontend
     npm install
     ```

3. **Run the applications:**
   - Backend:  
     ```bash
     # start MongoDB
     brew services start mongodb-community@7.0 
     npm start
     ```
   - Frontend:  
     ```bash
     npm start
     ```
