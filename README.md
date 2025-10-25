## Welcome to Career Guru ##
Project Name: Career Guru
Description:
Career Guru is a mobile app developed in TypeScript and Python. The frontend is primarily developed in React Native while the 
backend is coded in Python and connected via a FastAPI server. 

The primary objective of the app is to provide a platform for young adults ages 15-20 to discover their future career path. It
includes a chatbot providing friendly, empathetic conversation and advice, specially designed quizes to identify their strengths
and various resources to learn more and even experience about their possible future careers/professions. A majority of the 
features are powered by the DeepSeek AI Model API.

## Running the app ##
To properly use the app in this format, the frontend and backend must be individually started.

### Frontend ###
1. Navigate to the root directory, genAI_competition
2. Run the command 'npx expo start' (It may require you to install dependencies in which case use 'npm install' followed by
   whichever dependencies are required.
3. Click 'w' to start the web version and it will open the app in a web emulator on your browser. The Android and iOS
   versions require a pre-installed emulator but if you already have one then click 'a' or 'i' respectively to start the app
   in your installed emulator.

### Backend ###
1. Navigate to the chatbots directory within the root directory.
2. Run the command 'python3 interface.py' (again it may require you to first install some dependencies so use the same method)
3. Once started, it will output a series of console messages stating that it has started up.

Ensure you have the backend running, otherwise the majority of the features on the app will not function properly.
