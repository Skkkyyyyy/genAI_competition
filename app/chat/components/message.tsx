import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../lib/frontend_supa';

type MessageProps = {
    message?: string
}

const Message: React.FC<MessageProps> = ({ message = '' }) => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data?.user?.id ?? null);
        };
        fetchUser();
    }, []);

    return (
        <View className='flex-row items-center justify-end mt-2'>
            <View className='bg-bg2 m-1 p-1 rounded-lg mt-2 items-center shadow shadow-gray-300 min-w-72'>
                <Text className='flex-1 text-right font-light m-1 p-1'>{message}</Text>
            </View>
            <Ionicons name="person-circle-sharp" size={26} style={{ color: '#5296a5' }} className='m-2 mt-2'/>
        </View>
    )
}

export default Message

const styles = StyleSheet.create({})