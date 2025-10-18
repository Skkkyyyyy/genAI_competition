import Octicons from '@expo/vector-icons/Octicons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../lib/supabase';
import {insertMessage} from './insertMessage';
import Ionicons from '@expo/vector-icons/Ionicons';

type props = {
    prompt: string;
};

const Response = (props) => {
    const [generatedResponse, setGeneratedResponse] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    
    //fetch user id
    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data?.user?.id);
        };
        fetchUser();
    },[]);

    //fetch response from backend
    useEffect(()=>{
        const fetchResponse = async () => {
            const resp = await fetch("http://127.0.0.1:8000/chat",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({prompt:props.prompt}), // JSON.stringfy -> convert JS object to JSON string
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            setGeneratedResponse(data.choices[0].message.content);
        };
        fetchResponse();
    },[]);
    
    //save response to supabase
    const handleSave = async () => {
        if (generatedResponse!=="" && userId){
            console.log('Saving message for user:', userId);
            console.log('Prompt:', props.prompt);
            console.log('Response:', generatedResponse);
            await insertMessage(userId, props.prompt, generatedResponse);
        }
    }

    return (
        <View className='bg-bg2 m-2 p-2 rounded-lg mt-5 flex-row items-center shadow shadow-gray-300'>
            <Octicons className="m-1" name="dependabot" size={24} style={{color:'#0f7d80'}} />
            <Text className='flex-1 text-left font-light m-1 p-1'>{generatedResponse}</Text>
            <TouchableOpacity onPress={handleSave} >
                <Ionicons name="save-sharp" size={24} color="green" className="m-1" />
            </TouchableOpacity>
        </View>
    )
}
export default Response

const styles = StyleSheet.create({})