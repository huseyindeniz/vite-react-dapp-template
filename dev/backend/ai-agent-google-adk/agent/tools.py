from google.adk.tools import AgentTool
from .subagents import task_subagent

task_tool = AgentTool(task_subagent)