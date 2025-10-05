import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function Save() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [showCross, setShowCross] = useState(false);
    
    //fetch data 
    useEffect (() => {
        let cancelled = false;
        const fetchData = async() => {
            const {data: {user}} = await supabase.auth.getUser();
            const user_id = user?.id;

            const {data, error} = await supabase 
                .from ('messages')
                .select('*')
                .eq('user_id',user_id);

            if (!cancelled){
                if (error) {
                    console.log('Error fetching messages:', error);
                } else {
                    setData(data);
                }
            }
        }
        fetchData();  
    },[]);

    //delete data
    const handleDelete = async (message_id:string) => {
        const {data: {user}} = await supabase.auth.getUser();
        const user_id = user?.id;
        const {error} = await supabase 
            .from('messages')
            .delete()
            .eq('user_id',user_id)
            .eq('message_id',message_id);
        if (error) {
            console.log('Error deleting message:', error);
        } else {
            setData((prevData) => prevData.filter((item) => item.message_id !== message_id));
        }
    };

    const handleCrossToggle = () => {
        setShowCross((prev) => !prev);
    }

  return (
    <SafeAreaView className='h-full bg-white'>
        <View className='w-full flex-row items-center'>
            <TouchableOpacity className="pl-3 py-2 mx-2" onPress={()=>router.back()}>
                <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
            <Text className='text-2xl text-center text-black font-bold'>Saved Chats</Text>
            <TouchableOpacity className = "py-3 mx-2 items-end flex-1">
                <Ionicons name="trash-outline" size={24} color="black" className="absolute right-5" onPress= {handleCrossToggle}/>
            </TouchableOpacity>
        </View>
        <FlatList
            data = {data}
            renderItem={({item})=>
                <View className='flex-row p-3 mx-2 bg-gray-200 my-2'>
                    <View className='flex-col p-2 w-11/12'>
                        <Text className=''>{item.question.trim()}</Text>
                        <Text>{item.response.trim()}</Text>
                    </View>
                    {showCross && (<TouchableOpacity className='mx-2 flex-1 items-end justify-center ' onPress={()=>handleDelete(item.message_id)}>
                        <Entypo name="cross" size={24} color="black" />
                    </TouchableOpacity>)}
                </View>}
            keyExtractor={(item,index)=>index.toString()}
            contentContainerClassName='pb-32'/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})