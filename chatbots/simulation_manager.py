from chatbots.career_simulation import CareerSim


class SimulationManager:

    def __init__(self):
        self.simulations = []
        self.current_sim = 0

    def start_sim(self, situation: str):
        self.simulations.append(CareerSim(situation))
        self.current_sim = len(self.simulations) - 1

    def user_response(self, response: str):
        reply = self.simulations[self.current_sim].user_response(response)
        if self.simulations[self.current_sim].stage == 5:
            del self.simulations[self.current_sim]
            self.current_sim = 0
        return reply