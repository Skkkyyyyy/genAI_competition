from chatbot_connection import Chatbot_Connection as chatbot
import json
import random

class LittleLogicalMatthew:

    def __init__(self):
        self.chatbot_connections = {"analysis": chatbot(), "advice": chatbot()}
        self.bot = "analysis"
        with open('prompts.json', 'r') as prompts_file:
            self.prompts= json.load(prompts_file)
        self.initialise_chatbots()
        self.prev = "-1"

    def initialise_chatbots(self):
        self.chatbot_connections["analysis"].set_preset("You are analysing user responses for important information, keywords and overall theme")
        self.chatbot_connections["advice"].set_preset("You are a helpful councillor advising the user on career decisions but keep it casual and friendly")

    def call_chatbot(self, prompt: str, bot: str):
        return self.chatbot_connections[bot].chatbotResponse(prompt)

    # def call_matthew(self, message: str):
    #     if self.bot == "analysis":
    #         self.analyse_response(message)
    #     else:
    #

    def analyse_response(self, message: str):
        category = self.call_chatbot(self.prompts['Response Analysis']['Category'] + message, "analysis")
        # print(category)

        if category == "4":
            return self.call_chatbot(message, "advice")

        keyword = self.call_chatbot(self.prompts["Response Analysis"]["Keyword"] + message, "analysis")
        print(keyword)

        # if category == "-1": return self.prompts["Conversation Template"]["Request Clarification"][random.randint(len(self.prompts["Conversation Template"]["Request Clarification"]))]
        #
        # # if category == "1":
        #
        # if category == "2":
        #     subcat1 = self.call_chatbot(self.prompts["Response Analysis"][category]["Starter"], "analysis")
        #     print(subcat1)
        #     if subcat1 == "1":
        #         topic = self.call_chatbot(self.prompts["Response Analysis"][category][subcat1]["Starter"], "analysis")
        #         # get info using topic keyword and return string
        #     if subcat1 == "2":
        #         return self.call_chatbot(
        #             "Please rephrase the response to be a more natural response to the user's message but ensure you mention the keywords. Response: " +
        #             self.prompts["Response Analysis"][category][subcat1] + " User Message: " + message, "analysis")
        #
        # if category == "3":
        #     subcat1 = self.call_chatbot(self.prompts["Response Analysis"][category]["Starter"] + message, "analysis")
        #     print(subcat1)
        #     if subcat1 == "1":
        #         return self.call_chatbot(self.prompts["Response Analysis"][category][subcat1] + message, "advice")
        #     if subcat1 == "2":
        #         return self.call_chatbot(self.prompts["Response Analysis"][category][subcat1] + message, "advice")
        #     if subcat1 == "3":
        #         subcat2 = self.call_chatbot(self.prompts["Response Analysis"][category][subcat1] + message, "advice")
        #         if subcat2 == "1":
        #             subcat1 = "4"
        #         else:
        #             return subcat2
        #     if subcat1 == "4":
        #         return self.call_chatbot(
        #             "Please rephrase the response to be a more natural response to the user's message but ensure you mention the keywords. Response: " +
        #             self.prompts["Response Analysis"][category][subcat1] + " User Message: " + message, "analysis")
        #
        # if category == "4":
        #     subcat1 = self.call_chatbot(self.prompts["Response Analysis"][category]["Starter"] + message, "analysis")
        #     print(subcat1)
        #     if subcat1 == "-1":
        #         return self.call_chatbot(
        #             "Please rephrase the response to be a more natural response to the user's message but ensure you mention the keywords. Response: " +
        #             self.prompts["Response Analysis"][category][subcat1] + " User Message: " + message, "analysis")
        #     subcat2 = self.call_chatbot(self.prompts["Response Analysis"][category]["1"]["Starter"] + message, "analysis")
        #
        # if category == "5":
        #     return self.call_chatbot(message, "convo")
        #
        # if category == "6":
        #     # Ask the AI if the user's current responses can be used to answer of the psychanalysis questions and then store the result
        #     # questions = ""
        #     # for framework in self.prompts["Psychoanalysis Template"].items():
        #     #     for question in framework.items():
        #     #         questions += question + "\n"
        #     return self.call_chatbot(message, "convo")




    def initiate_convo(self):
        return (
            self.prompts["Conversation Template"]["Greetings"][random.randint(len(self.prompts["Conversation Template"]["Greetings"]))],
            self.prompts["Conversation Template"]["Greetings Follow-up"][random.randint(len(self.prompts["Conversation Template"]["Greetings Follow-up"]))]
        )

def test():
    test = LittleLogicalMatthew()
    while True:
        print(test.analyse_response(input()))

test()