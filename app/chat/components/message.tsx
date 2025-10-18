import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View} from 'react-native';
import insertMessage from './insertMessage';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase'

const Message = (props) => {
    console.log(props);
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const {data} = await supabase.auth.getUser();
            setUserId(data?.user?.id);
        };
        fetchUser();
    },[]);
    return (
        <View className='bg-bg2 m-2 p-2 rounded-lg mt-5 flex-row items-center shadow shadow-gray-300'>
            <Text className='flex-1 text-right font-light m-1 p-1'>{props.message}</Text>
            <Ionicons name="person-circle-sharp" size={24} style={{color:'#0f7d80'}} className="m-1" />
        </View>
    )
}

export default Message

const styles = StyleSheet.create({})