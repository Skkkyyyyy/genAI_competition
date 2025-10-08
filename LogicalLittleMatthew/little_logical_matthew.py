from chatbot_connection import Chatbot_Connection as chatbot
import json
import random

class LittleLogicalMatthew:

    def __init__(self):
        self.chatbot_connection = chatbot("0000")
        self.mode = "convo"
        with open('prompts.json', 'r') as prompts_file:
            self.prompts= json.load(prompts_file)


    def call_chatbot(self, message: str):
        pass

    def initiate_convo(self):

        return (
            self.prompts["Conversation Template"]["Greetings"][random.randint(len(self.prompts["Conversation Template"]["Greetings"]))],
            self.prompts["Conversation Template"]["Greetings Follow-up"][random.randint(len(self.prompts["Conversation Template"]["Greetings Follow-up"]))]
        )

def test():
    test = LittleLogicalMatthew()

test()