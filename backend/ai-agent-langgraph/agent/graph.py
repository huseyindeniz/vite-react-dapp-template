"""Main agent graph creation and configuration."""

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, END
from langgraph.graph.state import CompiledStateGraph

from agent.state import GraphState
from agent.nodes import agent_node, should_call_tools, tool_executor_node


def create_graph() -> CompiledStateGraph:
    """Create and compile the main LangGraph with subgraph support."""
    workflow = StateGraph(GraphState)

    # Add nodes
    workflow.add_node("agent", agent_node)
    workflow.add_node("tools", tool_executor_node)

    # Set entry point
    workflow.set_entry_point("agent")

    # Add conditional edges
    workflow.add_conditional_edges(
        "agent", should_call_tools, {"tools": "tools", "end": END}
    )

    # After tools, go back to agent for potential follow-up
    workflow.add_edge("tools", "agent")

    # Add MemorySaver for conversation history persistence
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory)


# Create singleton graph instance
graph = create_graph()
