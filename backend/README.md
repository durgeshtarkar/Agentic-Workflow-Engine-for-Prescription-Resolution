# Clinical Resolution Engine Backend

This is the fresh backend for the Agentic Prescription Analysis system.

## Project Structure
- `app/`: Main application logic.
  - `main.py`: Entry point for the FastAPI application.
  - `api/`: API route definitions.
- `venv/`: Virtual environment.
- `.env`: Environment variables (API keys, DB connection).

## Getting Started

1. **Activate Virtual Environment:**
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

2. **Configure Environment:**
   - Update `.env` with your `GROQ_API_KEY` and MongoDB URI.

3. **Run the Server:**
   ```bash
   # Default backend port is configured via .env (currently 8005)
   python -m uvicorn app.main:app --reload --port 8005
   ```

## API Documentation
Once the server is running, visit:
- Swagger UI: `http://localhost:8005/docs`
- Redoc: `http://localhost:8005/redoc`
