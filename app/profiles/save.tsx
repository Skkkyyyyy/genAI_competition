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
    type Message = { message_id: string; question: string; response: string }
    const [data, setData] = useState<Message[]>([]);
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
    <SafeAreaView className='bg-bg1 h-full w-full'>
        <View className='flex-row items-center justify-between px-4 py-3'>
            <View className='flex-row items-center'>
                <TouchableOpacity className="p-2 mr-2" onPress={()=>router.back()}>
                    <AntDesign name="left" size={22} color="#111827" />
                </TouchableOpacity>
                <Text className='text-2xl font-bold'>Saved Chats</Text>
            </View>
            <TouchableOpacity className = "py-3 mx-2 items-end flex-1">
                <Ionicons name="trash-outline" size={24} color="black" className="absolute right-5" onPress= {handleCrossToggle}/>
            </TouchableOpacity>
        </View>
        <FlatList
            data = {data}
            renderItem={({item}:{item:Message})=>
                <View className='mx-auto flex-row p-3 bg-bg2 w-11/12 my-2 rounded-xl mt-2'>
                    <View className='flex-col w-11/12 p-2 rounded-xl mx-auto'>
                        <View>
                            <Text className='font-medium text-lg '>Question</Text>
                            <Text className='font-light text-sm'>{String(item.question ?? '').trim()}</Text>
                        </View>
                        <View>
                            <Text className='mt-2 font-medium text-lg '>Answer</Text>
                            <Text className='font-light text-sm'>{String(item.response ?? '').trim()}</Text>
                        </View>
                    </View>
                    {showCross && (<TouchableOpacity className='items-end justify-center ' onPress={()=>handleDelete(item.message_id)}>
                        <Entypo name="cross" size={26} color="red" />
                    </TouchableOpacity>)}
                </View>}
            keyExtractor={(item: Message, index: number) => (item?.message_id ? String(item.message_id) : index.toString())}
            contentContainerClassName='pb-32'/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})