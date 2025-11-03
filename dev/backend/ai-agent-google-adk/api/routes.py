"""API route handlers."""

import json
from typing import AsyncGenerator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.adk.runners import InMemoryRunner
from google.genai import types

from api.models import GoogleADKChatRequest
from agent.agent import root_agent
from config import settings

router = APIRouter()

APP_NAME = "ai-chat-backend"

# Create singleton InMemoryRunner instance at module level for persistence
runner = InMemoryRunner(agent=root_agent, app_name=APP_NAME)
session_service = runner.session_service


async def stream_chat_response(request: GoogleADKChatRequest) -> AsyncGenerator[str, None]:
    """Stream chat responses using Google ADK runner.run_async."""

    # Configure user and session IDs
    user_id = request.user_id or "anonymous"
    session_id = request.session_id or "anonymous"

    # Get or create session
    try:
        existing_session = await session_service.get_session(
            app_name=APP_NAME, user_id=user_id, session_id=session_id
        )

        if not existing_session:
            await session_service.create_session(
                app_name=APP_NAME, user_id=user_id, session_id=session_id, state={}
            )
    except Exception as e:
        import traceback
        traceback.print_exc()
        yield f"data: {json.dumps({'type': 'error', 'message': f'Session error: {str(e)}'})}\n\n"
        return

    # Create Google ADK native message content
    content = types.Content(role="user", parts=[types.Part(text=request.message)])

    # Create RunConfig with SSE streaming mode
    run_config = RunConfig(streaming_mode=StreamingMode.SSE)

    # Stream events and extract only serializable data
    try:
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
            run_config=run_config,
        ):
            # Extract only serializable data from Google ADK events
            if hasattr(event, "partial") and event.partial:
                # Partial (streaming) response
                if hasattr(event, "content") and event.content:
                    if hasattr(event.content, "parts") and event.content.parts:
                        for part in event.content.parts:
                            if hasattr(part, "text") and part.text:
                                yield f"data: {json.dumps({'type': 'token', 'content': part.text})}\n\n"

    except Exception as e:
        import traceback
        traceback.print_exc()
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    # Send end signal
    yield f"data: {json.dumps({'type': 'end'})}\n\n"


@router.post("/chat")
async def chat_endpoint(request: GoogleADKChatRequest):
    """Native Google ADK chat endpoint with SSE streaming."""
    return StreamingResponse(
        stream_chat_response(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ai-agent-google-adk",
        "version": "0.1.0",
        "google_api_configured": bool(settings.GOOGLE_API_KEY),
    }
