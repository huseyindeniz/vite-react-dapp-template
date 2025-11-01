"""Main application entry point."""

from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    print("AI Chat Agent Backend with Google ADK starting up...")
    print(
        f"Google API Key: {'SET' if settings.GOOGLE_API_KEY else 'NOT SET (using mock responses)'}"
    )
    yield
    print("AI Chat Agent Backend shutting down...")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="AI Chat Agent Backend with Google ADK",
        description="Google ADK-based chat agent backend for vite-react-dapp-template",
        version="0.1.0",
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )

    # Include routes
    app.include_router(router)

    return app


app = create_app()


def main():
    """Run the server."""
    print(f"Starting AI Chat Agent Backend on {settings.HOST}:{settings.PORT}")
    print(f"Debug mode: {settings.DEBUG}")
    print(f"CORS origins: {settings.CORS_ORIGINS}")

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL,
        access_log=True,
    )


if __name__ == "__main__":
    main()
