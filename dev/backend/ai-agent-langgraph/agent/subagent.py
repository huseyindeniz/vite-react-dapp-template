"""Subagent graph for handling complex tasks."""

from typing import Any
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.graph.state import CompiledStateGraph

from agent.state import SubagentState
from config import settings


async def subagent_node(state: SubagentState) -> dict[str, Any]:
    """Subagent that executes the task."""
    task = state.get("task", "")

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, streaming=True)

    subagent_messages = [
        SystemMessage(content=f"You are a helpful subagent. Execute this task: {task}"),
        HumanMessage(content=f"Please complete the following task: {task}"),
    ]

    if settings.OPENAI_API_KEY:
        response = await llm.ainvoke(subagent_messages)
        result = response.content
    else:
        result = f"Mock subagent result for task: {task}"

    return {"messages": [AIMessage(content=result)], "result": result}


def create_subagent_graph() -> CompiledStateGraph:
    """Create and compile the subagent graph."""
    workflow = StateGraph(SubagentState)
    workflow.add_node("execute_task", subagent_node)
    workflow.set_entry_point("execute_task")
    workflow.add_edge("execute_task", END)
    return workflow.compile()
