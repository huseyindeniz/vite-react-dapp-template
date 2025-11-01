"""State definitions for LangGraph agents."""

from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import add_messages


class GraphState(TypedDict):
    """State for the main conversation graph."""

    messages: Annotated[Sequence[BaseMessage], add_messages]


class SubagentState(TypedDict):
    """State for the subagent graph."""

    messages: Annotated[Sequence[BaseMessage], add_messages]
    task: str
    result: str
