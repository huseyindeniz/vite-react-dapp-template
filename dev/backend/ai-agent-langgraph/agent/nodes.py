"""Agent nodes for the main conversation graph."""

from typing import Any
from langchain_core.messages import AIMessage, ToolMessage
from langchain_openai import ChatOpenAI

from agent.state import GraphState
from agent.tools import task_tool
from agent.subagent import create_subagent_graph
from config import settings


# Initialize subagent graph
subagent_graph = create_subagent_graph()


async def agent_node(state: GraphState) -> dict[str, Any]:
    """Main agent node that can call tools."""
    messages = state.get("messages", [])

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, streaming=True)
    llm_with_tools = llm.bind_tools([task_tool])

    if settings.OPENAI_API_KEY:
        response = await llm_with_tools.ainvoke(messages)
    else:
        print("WARNING: No OpenAI API key found - using mock response")
        response = AIMessage(
            content="I'll help you with that task.",
            tool_calls=[
                {
                    "id": "task_001",
                    "name": "task_tool",
                    "args": {"task_description": "Complete the requested task"},
                }
            ],
        )

    return {"messages": [response]}


def should_call_tools(state: GraphState) -> str:
    """Determine if tools should be called."""
    messages = state.get("messages", [])
    if not messages:
        return "end"

    last_message = messages[-1]
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "tools"

    return "end"


async def tool_executor_node(state: GraphState) -> dict[str, Any]:
    """Execute tool calls, including Task tool which spawns subagents."""
    messages = state.get("messages", [])
    if not messages:
        return {"messages": []}

    last_message = messages[-1]
    if not isinstance(last_message, AIMessage) or not last_message.tool_calls:
        return {"messages": []}

    tool_messages = []
    for tool_call in last_message.tool_calls:
        if tool_call["name"] == "task_tool":
            task_description = tool_call["args"].get("task_description", "")

            subagent_state = {"messages": [], "task": task_description, "result": ""}

            final_state = await subagent_graph.ainvoke(subagent_state)

            tool_message = ToolMessage(
                content=final_state.get("result", "Task completed"),
                tool_call_id=tool_call["id"],
                artifact={"subgraph_state": final_state},
            )
            tool_messages.append(tool_message)
        else:
            tool_message = ToolMessage(
                content=f"Executed tool {tool_call['name']}",
                tool_call_id=tool_call["id"],
            )
            tool_messages.append(tool_message)

    return {"messages": tool_messages}
