from google.adk.agents import Agent
from google.genai import types

task_subagent = Agent(
    name="task_subagent",
    model="gemini-2.0-flash",
    description="Executes a single inferred task from user input.",
    instruction="Extract the intended task and execute it. Return only the result text.",
    generate_content_config=types.GenerateContentConfig(temperature=0.7),
)