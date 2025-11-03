"""API route handlers."""

import json
from typing import AsyncGenerator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableConfig

from api.models import LangGraphChatRequest
from agent.graph import graph
from config import settings

router = APIRouter()


async def stream_chat_response(request: LangGraphChatRequest) -> AsyncGenerator[str, None]:
    """Stream chat responses using LangGraph astream_events."""

    # Create LangGraph native input
    input_state = {"messages": [HumanMessage(content=request.message)]}

    # Configure thread and user IDs
    thread_id = request.thread_id or "anonymous"
    user_id = request.user_id or "anonymous"
    config: RunnableConfig = {"configurable": {"thread_id": thread_id, "user_id": user_id}}

    # Stream events and extract only serializable data
    try:
        async for event in graph.astream_events(input_state, config, version="v2"):
            event_type = event.get("event")
            event_name = event.get("name", "")

            # Extract only serializable data from events
            if event_type == "on_chat_model_stream":
                # Token streaming
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content") and chunk.content:
                    yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"

            elif event_type == "on_tool_start":
                # Tool execution started
                tool_data = {"type": "tool_start", "name": event_name}
                yield f"data: {json.dumps(tool_data)}\n\n"

            elif event_type == "on_tool_end":
                # Tool execution ended
                tool_data = {"type": "tool_end", "name": event_name}
                yield f"data: {json.dumps(tool_data)}\n\n"

    except Exception as e:
        import traceback
        traceback.print_exc()
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    # Send end signal
    yield f"data: {json.dumps({'type': 'end'})}\n\n"


@router.post("/chat")
async def chat_endpoint(request: LangGraphChatRequest):
    """Native LangGraph chat endpoint with SSE streaming."""
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
