"""Pydantic models for API request/response."""

from typing import Annotated, Any, Literal, Optional, Union
from pydantic import BaseModel, Field, Discriminator


class MessagePart(BaseModel):
    """A part of a user message."""

    type: str = Field(..., description="The type of message part")
    text: Optional[str] = Field(None, description="Text content")
    image: Optional[str] = Field(None, description="Image URL or data")


class UserMessage(BaseModel):
    """A user message."""

    role: str = Field(default="user", description="Message role")
    parts: list[MessagePart] = Field(..., description="Message parts")


class AddMessageCommand(BaseModel):
    """Command to add a new message to the conversation."""

    type: Literal["add-message"] = Field(
        default="add-message", description="Command type"
    )
    message: UserMessage = Field(..., description="User message")


class AddToolResultCommand(BaseModel):
    """Command to add a tool result to the conversation."""

    type: Literal["add-tool-result"] = Field(
        default="add-tool-result", description="Command type"
    )
    toolCallId: str = Field(..., description="ID of the tool call")
    result: dict[str, Any] = Field(..., description="Tool execution result")


Command = Annotated[
    Union[AddMessageCommand, AddToolResultCommand], Discriminator("type")
]


class ChatRequest(BaseModel):
    """Request payload for the chat endpoint."""

    commands: list[Command] = Field(..., description="List of commands to execute")
    system: Optional[str] = Field(None, description="System prompt")
    tools: Optional[dict[str, Any]] = Field(None, description="Available tools")
    runConfig: Optional[dict[str, Any]] = Field(None, description="Run configuration")
    state: Optional[dict[str, Any]] = Field(None, description="State")
    token: Optional[str] = Field(
        None, description="Auth token for session tracking (TODO: Add validation)"
    )
