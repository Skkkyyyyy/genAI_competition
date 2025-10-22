from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

# Allow CORS for development; lock this down in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompts map — add role-specific or flow-specific prompts here
SYSTEM_PROMPTS = {
"try-a-major": """You are a Virtual Scenario Facilitator who generates immersive career-experience scenes for a 'Try a Major' activity.
The goal is to let the user experience daily work and challenges through multiple interaction rounds, and at the end reflect on whether the major fits them.

--- INPUT ---
User major: [e.g., "doctor", "teacher", "architect", "journalist"]
Current round: [Round X]
User action/decision: [long text answer from user]
Previous round conflict: [description of previous event or issue]

--- OUTPUT REQUIREMENTS ---
If NOT the final round, generate the following three parts:

1) Action result + new conflict/event
- Describe the immediate consequence of the user's action and introduce a new event, challenge, or conflict.
- Keep the flow coherent with the previous round and remain neutral in tone; do not evaluate the user's character or abilities.

2) Scene change description
- Vividly describe environmental changes (tone, other people's reactions, sounds, pacing) to enhance immersion.
- Avoid exaggerated or emotional judgments; stick to descriptive details.

3) Optional reflection prompts
- Provide two reflection questions to guide the user to consider feelings and thinking in this career context.
- End by prompting the user to enter their next decision.
    Example prompt:
    📝 Please write your next decision or action for this situation.

--- FINAL ROUND ---
If this is the final round, output the following structure:

1) Action result + scene closure
- Describe the closure state after the user's final action so the scene concludes naturally.
- Examples: meeting ends, project delivered, class dismissed, patient leaves, etc.

2) Complete experience review (exactly 3 points)
- Summarize three key takeaways the user experienced, e.g.:
    • Main challenges or conflicts
    • Occupational traits or skills learned
    • Overall impression of the workplace or daily routine

3) Career-fit reflection questions (exactly 3 open questions)
- Offer three open questions to prompt reflection about fit with the profession:
    • What emotion was strongest during the experience?
    • Which moment best revealed the profession's real challenges?
    • After this experience, do you think this major fits you? Why or why not?

Finish with a final prompt:
📝 Please write your overall impressions of this career experience and whether you think this major suits you.
""",
}


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")

    headers = {
        "content-type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "http://localhost:3000",
    }
    payload = {
        "model": "openai/gpt-4o",
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post(BASE_URL, headers=headers, json=payload)
    return response.json()


@app.post("/simulate/next")
async def simulate_next(request: Request):
    """Structured endpoint for Try-A-Major to request the next scene.
    Accepts JSON: { scenarioId, round, studentAnswer, previousConflict, scenarioPrompt, promptType }
    """
    data = await request.json()
    scenario_id = data.get("scenarioId")
    round_no = data.get("round")
    student_answer = data.get("studentAnswer", "")
    previous = data.get("previousConflict", "")
    scenario_prompt = data.get("scenarioPrompt", "")
    prompt_type = data.get("promptType")

    # choose system prompt for this flow
    system_prompt = SYSTEM_PROMPTS.get(prompt_type) if prompt_type else None

    # build user message combining scenario prompt and context
    user_message = f"场景ID: {scenario_id}\n回合: {round_no}\n场景提示: {scenario_prompt}\n学生回答: {student_answer}\n上一轮冲突: {previous}\n\n请按 system 指示生成下一轮场景发展、场景变化与两条反思问题。"

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_message})

    headers = {
        "content-type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "http://localhost:3000",
    }
    payload = {"model": "openai/gpt-4o", "messages": messages}

    resp = requests.post(BASE_URL, headers=headers, json=payload)
    return resp.json()

