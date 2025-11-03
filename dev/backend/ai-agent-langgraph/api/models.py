"""Pydantic models for API request/response."""

from typing import Optional
from pydantic import BaseModel, Field


class LangGraphChatRequest(BaseModel):
    """Native LangGraph chat request format."""

    message: str = Field(..., description="User message text")
    thread_id: Optional[str] = Field(
        None, description="Thread ID for conversation persistence"
    )
    user_id: Optional[str] = Field(None, description="User ID for tracking")
