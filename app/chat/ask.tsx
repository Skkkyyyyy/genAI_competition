import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';
import Message from './components/message';
import Response from './components/response';
import { supabase } from '../../lib/supabase';


export default function ask() {
    const [text, setText] = useState(" ");
    const [myData, setMyData] = useState<string[]>([]);
    const InputAccessoryViewID = 'inputAccessoryView1';
    const router = useRouter();

    const SearchInput = () => {
        if (text.trim().length !== 0){
            setMyData((prevData)=>[...prevData,text]);
            setText("");
        }
    };
    console.log(myData);
    return(
        <SafeAreaView className='flex-1 h-full'>
                {/*header*/}
                <TouchableOpacity className="w-full pl-3 py-2" onPress={()=>router.back()}>
                    <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>
                <View className='bg-blue-300 h-1/4 w-full p-6 justify-center'>
                    <Text className='text-xl text-center'>LITTLE MATTHEW</Text>
                </View>

                {/*Contents*/}
                <FlatList
                    data = {myData}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem = {({item})=>(
                        <View>
                            <Message message = {item}/>
                            <Response prompt = {item} />
                        </View>
                    )}
                    contentContainerClassName='pb-32'
                />

                {/*search-bar*/}
                <View className='bg-white w-full absolute bottom-0 h-32 flex-row'>
                    <View className='bg-white py-2'>
                        <Ionicons name="add-circle-outline" size={40} color="gray" className='mx-1 mt-1' />
                    </View>
                    <>
                        <View className='flex-1 flex-row bg-white py-2'>
                            <TextInput
                                className='h-14 flex-1 border-transparent bg-gray-200 rounded-full text-black p-5'
                                placeholder="Write down your thoughts on career"
                                value = {text}
                                onChangeText={setText}
                                inputAccessoryViewID={InputAccessoryViewID}
                                returnKeyType='send'
                                onSubmitEditing={SearchInput}
                            />
                            <TouchableOpacity onPress={SearchInput}>
                                <Ionicons name="send-outline" size={40} color="gray" className='mx-1 mt-1' />
                            </TouchableOpacity>
                        </View>
                    </>
                </View>

            {/*
            {Platform.OS === "ios" && (
            <InputAccessoryView nativeID={InputAccessoryViewID}>
                <View className='bg-white w-full absolute bottom-0 h-18 flex-row'>
                    <View className='bg-white py-2'>
                        <Ionicons name="add-circle-outline" size={40} color="gray" className='mx-1 mt-1' />
                    </View>
                    <>
                        <View className='flex-1 flex-row bg-white py-2'>
                            <TextInput
                                className='h-14 flex-1 border-transparent bg-gray-200 rounded-full text-gray-300'
                                placeholder='Write down your thoughts on career'
                                value = {text}
                                onChangeText={setText}
                                inputAccessoryViewID={InputAccessoryViewID}
                            />
                            <TouchableOpacity onPress={SearchInput}>
                                <Ionicons name="send-outline" size={40} color="gray" className='mx-1 mt-1' />
                            </TouchableOpacity>
                        </View>
                    </>
                </View>
            </InputAccessoryView> 
)}*/}
        </SafeAreaView>
    );
}
