"""LangChain tools for the AI agent."""

from langchain_core.tools import tool


@tool
def task_tool(task_description: str) -> str:
    """
    Execute a complex task using a subagent.

    Args:
        task_description: Description of the task to perform

    Returns:
        The result of the task execution
    """
    return f"Task '{task_description}' will be executed by the subagent."
