from django.conf import settings
from openai import OpenAI


client = OpenAI(api_key=settings.OPENAI_API_KEY)


def generate_course_ai_response(*, course, knowledge, user_message, action="ask"):
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not configured.")

    action_instruction = ""

    if action == "quiz":
        action_instruction = """
Create a short quiz based ONLY on the provided course material.
Use clear questions.
Include answers at the end.
"""
    elif action == "exercises":
        action_instruction = """
Create practical exercises based ONLY on the provided course material.
Make them suitable for students.
Include answers if useful.
"""
    elif action == "examples":
        action_instruction = """
Generate clear examples based ONLY on the provided course material.
Do not use examples from outside the course material.
"""
    else:
        action_instruction = """
Answer the student's question based ONLY on the provided course material.
"""

    system_prompt = f"""
You are an educational AI assistant inside X Platform.

IMPORTANT RULES:
1. You must answer ONLY using the provided course material.
2. Do NOT use outside knowledge.
3. If the answer is not found in the course material, say:
   "هذا السؤال خارج محتوى هذا الكورس أو غير موجود في المادة العلمية المقدمة."
4. Keep the answer clear and student-friendly.
5. You may explain, simplify, generate examples, quizzes, or exercises only from the course material.

Course Title:
{course.title}

Course Material:
{knowledge.content}

Additional Teacher Instructions:
{knowledge.instructions or "No additional instructions."}

Task:
{action_instruction}
"""

    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_message,
            },
        ],
    )

    usage = getattr(response, "usage", None)

    return {
        "result": response.output_text,
        "prompt_tokens": getattr(usage, "input_tokens", 0) if usage else 0,
        "completion_tokens": getattr(usage, "output_tokens", 0) if usage else 0,
        "total_tokens": getattr(usage, "total_tokens", 0) if usage else 0,
    }