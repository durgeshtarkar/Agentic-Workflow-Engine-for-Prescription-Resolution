from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.services.database import connect_to_mongo, close_mongo_connection

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("API starting up...")
    await connect_to_mongo()
    print("Startup complete.")
    yield
    # Shutdown
    print("API shutting down...")
    await close_mongo_connection()

app = FastAPI(
    title="Clinical Resolution Engine API",
    description="Backend for the Agentic Prescription Analysis System",
    version="2.0.0",
    lifespan=lifespan
)

from app.api.api import api_router
from fastapi import Request
import time

import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("clinical_engine")

from starlette.exceptions import HTTPException as StarletteHTTPException

# @app.middleware("http")
# async def add_process_time_header(request: Request, call_next):
#     start_time = time.time()
#     logger.info(f"REQ: {request.method} {request.url}")
#     try:
#         response = await call_next(request)
#         process_time = time.time() - start_time
#         logger.info(f"RES: {request.method} {request.url} - {response.status_code} ({process_time:.2f}s)")
#         return response
#     except StarletteHTTPException as he:
#         # Let FastAPI's built-in handlers handle it
#         raise he
#     except Exception as e:
#         logger.error(f"CRITICAL ERROR: {str(e)}")
#         from fastapi.responses import JSONResponse
#         return JSONResponse(
#             status_code=500,
#             content={"detail": f"Clinical system error: {str(e)}", "msg": str(e)}
#         )




# ... (CORS removed from this chunk for brevity, but I must keep it in the file)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Clinical Resolution Engine API is running smoothly",
        "version": "2.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", os.getenv("BACKEND_PORT", 8001)))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
