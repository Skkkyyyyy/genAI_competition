from chatbot_connection import Chatbot_Connection as chatbot

import json

class CareerSim:

    def __init__(self, situation: str):
        self.chatbot_connection = chatbot()
        self.situation = situation
        with open('prompts.json', 'r') as prompts_file:
            self.prompts= json.load(prompts_file)

    def initialise_simulation(self):
        self.chatbot_connection.set_preset(self.prompts["Simulation Template"]["Initial"] + self.situation)

    def user_response(self, response: str):
        return self.chatbot_connection.chatbotResponse(self.prompts["Simulation Template"]["User Response"] + response)

def test():
    tester = CareerSim("You are a primary school teacher who has just entered the classroom. Some students are playing, chatting and messing around, while only a few are quietly working on their assignments. The classroom is noisy but lively. How would you restore order to the classroom?")
    tester.initialise_simulation()
    for i in range(6):
        print(tester.user_response(input()))

test()