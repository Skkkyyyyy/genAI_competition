import requests
import credentials

# Set your API key and endpoint
api_key = credentials.DEEPSEEK_API_KEY # Replace with your actual API key
base_url = "https://api.deepseek.com/chat/completions"

class Chatbot_Connection:

    def __init__(self):
        

    def chatbotResponse(prompt: str, preset: str):
        # Define the request headers
        print('Getting chatbot response')
        headers = {
            "Authorization": f"Bearer {api_key}",  # Authorization header with the API key
            "Content-Type": "application/json"     # Content type for JSON payload
        }

        # Define the request payload
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": f'{preset}'},
                {"role": "user", "content": f"{prompt}"}
            ],
            "stream": True
        }

        try:
            # Make a POST request to the API
            response = requests.post(base_url, headers=headers, json=payload)

            # Check if the request was successful
            if response.status_code == 200:
                data = response.json()
                # Access the response content
                return data["choices"][0]["message"]["content"]
            else:
                print(f"Error: {response.status_code} - {response.text}")

        except requests.RequestException as e:
            print(f"An error occurred: {e}")
