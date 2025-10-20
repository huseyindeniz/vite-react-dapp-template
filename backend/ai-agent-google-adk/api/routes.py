"""API route handlers."""

import json
from typing import AsyncGenerator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.adk.runners import InMemoryRunner
from google.genai import types

from api.models import ChatRequest, AddMessageCommand, AddToolResultCommand
from agent.agent import root_agent
from config import settings

router = APIRouter()

APP_NAME = "ai-chat-backend"

# Create singleton InMemoryRunner instance at module level for persistence
runner = InMemoryRunner(agent=root_agent, app_name=APP_NAME)
session_service = runner.session_service


async def stream_chat_response(request: ChatRequest) -> AsyncGenerator[str, None]:
    """Stream chat responses using Google ADK Agent with Runner."""

    # Process commands to build input message
    user_messages = []

    for command in request.commands:
        if isinstance(command, AddMessageCommand):
            text_parts = [
                part.text
                for part in command.message.parts
                if part.type == "text" and part.text
            ]
            if text_parts:
                user_messages.append(" ".join(text_parts))
        elif isinstance(command, AddToolResultCommand):
            # Handle tool results if needed
            user_messages.append(f"Tool result: {command.result}")

    if not user_messages:
        yield f"data: {json.dumps({'type': 'error', 'message': 'No user message found'})}\n\n"
        return

    user_input = "\n".join(user_messages)

    # Stream responses from Google ADK Agent using Runner
    try:

        # Use auth token for session_id and user_id
        token = request.token or "anonymous"
        session_id = token
        user_id = token
        # TODO: Add token validation (JWT verify, OAuth token check, etc.)

        # Get or create session based on token
        existing_session = await session_service.get_session(
            app_name=APP_NAME, user_id=user_id, session_id=session_id
        )

        if not existing_session:
            # Create new session if it doesn't exist
            await session_service.create_session(
                app_name=APP_NAME, user_id=user_id, session_id=session_id, state={}
            )

        # Prepare the user message
        content = types.Content(role="user", parts=[types.Part(text=user_input)])

        # Create RunConfig with SSE streaming mode
        run_config = RunConfig(streaming_mode=StreamingMode.SSE)

        # Run the agent asynchronously and stream events
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
            run_config=run_config,
        ):
            # Stream partial events (streaming tokens)
            if hasattr(event, "partial") and event.partial:
                if (
                    hasattr(event, "content")
                    and event.content
                    and hasattr(event.content, "parts")
                    and event.content.parts
                ):
                    for part in event.content.parts:
                        if hasattr(part, "text") and part.text:
                            data = {"type": "message", "delta": part.text}
                            yield f"data: {json.dumps(data)}\n\n"

    except Exception as e:
        import traceback

        traceback.print_exc()
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    # Send end signal
    yield f"data: {json.dumps({'type': 'end'})}\n\n"


@router.post("/assistant")
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint using Google ADK Agent with SSE streaming."""
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
