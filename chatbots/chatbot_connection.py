import requests
import credentials

# Set your API key and endpoint
api_key = credentials.DEEPSEEK_API_KEY # Replace with your actual API key
base_url = "https://api.deepseek.com/chat/completions"

class Chatbot_Connection:

    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {api_key}",  # Authorization header with the API key
            "Content-Type": "application/json"  # Content type for JSON payload
        }
        self.chat_history = []
        self.payload ={
            "model": "deepseek-chat",
            "messages": self.chat_history,
            "stream": False
        }
        self.initialised = False

    def set_preset(self, preset: str):
        self.chat_history.append({"role": "system", "content": f'{preset}'})
        self.initialised = True

    def chatbotResponse(self, prompt: str):
        if self.initialised:
            self.chat_history.append({"role": "user", "content": f'{prompt}'})

            # print("Calling chatbot")
            try:
                # Make a POST request to the API
                response = requests.post(base_url, headers=self.headers, json=self.payload)

                # Check if the request was successful
                if response.status_code == 200:
                    data = response.json()
                    # Access the response content
                    self.chat_history.append({"role": "assistant", "content":f'{data["choices"][0]["message"]["content"]}'})
                    return data["choices"][0]["message"]["content"]
                else:
                    print(f"Error: {response.status_code} - {response.text}")

            except requests.RequestException as e:
                print(f"An error occurred: {e}")
        else:
            print("Preset not yet initialised")

# def test():
#     test = Chatbot_Connection("0001")
#     test.set_preset("You are a person having a normal conversation")
#     while True:
#         print(test.chat_history)
#         print(test.chatbotResponse(input()))
#
# test()

