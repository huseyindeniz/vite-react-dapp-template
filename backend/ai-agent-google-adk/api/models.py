"""Pydantic models for API request/response."""

from typing import Optional
from pydantic import BaseModel, Field


class GoogleADKChatRequest(BaseModel):
    """Native Google ADK chat request format."""

    message: str = Field(..., description="User message text")
    user_id: Optional[str] = Field(None, description="User ID for tracking")
    session_id: Optional[str] = Field(
        None, description="Session ID for conversation persistence"
    )
