import google.generativeai as genai
from google.generativeai.types import GenerationConfig



genai.configure(api_key="AIzaSyATjvLcl3A2mPVR3DzwzqvxoUfTKyxI_GA")
model = genai.GenerativeModel(model_name="gemini-2.0-flash")
chat = genai.GenerativeModel(model_name="gemini-2.0-flash").start_chat()


def start_chat(initial_prompt,existing_history):
    global chat
    chat = genai.GenerativeModel("gemini-2.0-flash").start_chat()
    chat.send_message(initial_prompt)
    for message in existing_history:
        chat.send_message(message["parts"][0])
    
    
def send_chat_message(user_message):
    response = chat.send_message(user_message, generation_config=GenerationConfig(
        response_mime_type="application/json"))
    return response.text

def get_response_from_llm(prompt):
    response = model.generate_content(contents=prompt, generation_config=GenerationConfig(
        response_mime_type="application/json"))

    return response.text