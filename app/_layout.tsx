import { Stack } from "expo-router";
import './global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
      <Stack.Screen name="chat/ask" options={{headerShown:false}}/>
      <Stack.Screen name="chat/form" options={{headerShown:false}}/>
      <Stack.Screen name="auth/auth" options={{headerShown:false}}/>
    </Stack>
  );
}
