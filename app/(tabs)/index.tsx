//chat
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto';
import 'whatwg-fetch';
import '../global.css';

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <View className="w-ful mt-2">
          <Text className="text-3xl text-center font-bold ">Career Guru</Text>
      </View>
      <View className="flex-col h-4/5 my-auto">
        <Pressable 
          className="bg-white w-10/12 mx-auto rounded-2xl shadow shadow-gray-400"
          onPress={()=>router.push('/chat/ask')}>
          <Text className="text-2xl font-bold mx-5 mt-5">Chat with the Career Bot</Text>
          <View className="items-center p-5 ">
            <Text className="  text-sm font-light text-gray-500">Tell us anything about your career concerns, interests, or dreams - and our chatbot will respond to you directly.</Text>
          </View>
        </Pressable>
        <Pressable 
          className="mt-10 bg-white w-10/12 mx-auto rounded-2xl shadow shadow-gray-400"
          onPress={()=>router.push('/chat/form')}>
          <Text className="text-2xl font-bold mx-5 mt-5">Get Personalized Recommendations</Text>
          <View className="items-center  p-5 ">
            <Text className="text-sm font-light text-gray-500">Fill out a quick form about your background and preferences. Based on your answers, our chatbot will suggest tailored career and major recommendations.
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
