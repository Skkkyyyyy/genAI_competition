import { Stack } from "expo-router";
import './global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
      <Stack.Screen name="chat/ask" options={{headerShown:false}}/>
      <Stack.Screen name="chat/form" options={{headerShown:false}}/>
      <Stack.Screen name="auth/auth" options={{headerShown:false}}/>
      <Stack.Screen name="auth/components/Login" options={{headerShown:false}}/>
      <Stack.Screen name="auth/components/Account" options={{headerShown:false}}/>
      <Stack.Screen name="auth/components/Signup" options={{headerShown:false}}/>
      <Stack.Screen name="profiles/userProfile" options={{headerShown:false}}/>
      <Stack.Screen name="profiles/save" options={{headerShown:false}}/>
      <Stack.Screen name="profiles/editProfile" options={{headerShown:false}}/>
      <Stack.Screen name="try-a-major/index" options={{headerShown:false}}/>
      <Stack.Screen name="try-a-major/simulate" options={{headerShown:false}}/>
      <Stack.Screen name="try-a-major/run" options={{headerShown:false}}/>
      <Stack.Screen name="quiz/quizQuestions" options={{headerShown:false}}/>
      <Stack.Screen name="quiz/quizHome" options={{headerShown:false}}/>
      <Stack.Screen name="quiz/quizEnd" options={{headerShown:false}}/>
    </Stack>
  );
}
