from google.adk.agents import Agent
from google.genai import types
from .tools import task_tool
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

root_agent = Agent(
    name="root_agent",
    model="gemini-2.0-flash",
    description="Root agent that delegates work to task_tool.",
    instruction="""
    If user asks you to do a task, call task_tool() to perform the user's request.
    After it finishes, return exactly its final message.
    """,
    tools=[task_tool],
    generate_content_config=types.GenerateContentConfig(temperature=0),
)
