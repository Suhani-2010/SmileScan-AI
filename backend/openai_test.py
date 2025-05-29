from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # loads your .env in backend folder

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = "You are a dental radiologist. Write a brief diagnostic report for a cavity detected."

try:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # simpler for test
        messages=[
            {"role": "system", "content": "You are a dental radiologist."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0.4
    )
    print("OpenAI test output:")
    print(response.choices[0].message.content.strip())
except Exception as e:
    print("OpenAI test error:", e)

