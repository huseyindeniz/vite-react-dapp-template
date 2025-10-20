"""API route handlers."""

import json
from typing import AsyncGenerator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, ToolMessage
from langchain_core.runnables import RunnableConfig

from api.models import ChatRequest, AddMessageCommand, AddToolResultCommand
from agent.graph import graph
from config import settings

router = APIRouter()


async def stream_chat_response(request: ChatRequest) -> AsyncGenerator[str, None]:
    """Stream chat responses using LangGraph astream."""

    # Process commands to build input messages
    input_messages = []

    for command in request.commands:
        if isinstance(command, AddMessageCommand):
            text_parts = [
                part.text
                for part in command.message.parts
                if part.type == "text" and part.text
            ]
            if text_parts:
                input_messages.append(HumanMessage(content=" ".join(text_parts)))
        elif isinstance(command, AddToolResultCommand):
            input_messages.append(
                ToolMessage(
                    content=str(command.result), tool_call_id=command.toolCallId
                )
            )

    input_state = {"messages": input_messages}

    # Use auth token for thread_id and user_id
    token = request.token or "anonymous"
    thread_id = token
    user_id = token
    config: RunnableConfig = {"configurable": {"thread_id": thread_id, "user_id": user_id}}
    # TODO: Add token validation (JWT verify, expiry check, etc.)

    # Stream responses from LangGraph using astream_events for real streaming
    try:
        async for event in graph.astream_events(input_state, config, version="v2"):
            kind = event.get("event")

            # Stream LLM token chunks
            if kind == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content"):
                    delta = chunk.content
                    if delta:
                        data = {"type": "message", "delta": delta}
                        yield f"data: {json.dumps(data)}\n\n"
    except Exception as e:
        import traceback

        traceback.print_exc()
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    # Send end signal
    yield f"data: {json.dumps({'type': 'end'})}\n\n"


@router.post("/assistant")
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint using LangGraph with SSE streaming."""
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
        "service": "ai-agent-langgraph",
        "version": "0.1.0",
        "openai_configured": bool(settings.OPENAI_API_KEY),
    }
