import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { deleteMessage, insertMessage } from './handleSave';

type ResponseProps = {
    prompt: string;
};

const Response: React.FC<ResponseProps> = ({ prompt }) => {
    const [generatedResponse, setGeneratedResponse] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [savedMessageId, setSavedMessageId] = useState<string | null>(null);

    //fetch user id
    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUserId(data?.user?.id ?? null);
        };
        fetchUser();
    },[]);

    //fetch response from backend
    useEffect(()=>{
        const fetchResponse = async () => {
            try {
                const resp = await fetch("http://localhost:8000/llm/chat",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ prompt }), // send the prompt string
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                setGeneratedResponse(data.response ?? 'Unable to parse response');
            } catch (err) {
                console.error('fetchResponse error', err);
                setGeneratedResponse('Unable to fetch response')
            }
        };
        fetchResponse();
    },[prompt]);
    
    //save response to supabase / delete response from supabase
    const handleSave = async () => {
        const newIsSaved = !isSaved;
        setIsSaved(newIsSaved);
        if (newIsSaved) {
            // Save the generated response
            if (generatedResponse !== "" && userId) {
                console.log('Saving message for user:', userId);
                console.log('Prompt:', prompt);
                console.log('Response:', generatedResponse);
                const inserted = await insertMessage(userId, prompt, generatedResponse);
                const id = inserted?.[0]?.message_id ?? null;
                if (id) setSavedMessageId(String(id));
            }
        } else {
            // Unsave / delete
            if (savedMessageId && userId) {
                await deleteMessage(userId, savedMessageId);
                setSavedMessageId(null);
            }
        }
    }

    return (
        <>
        <View className='flex-row items-center mt-2 max-w-80'>
            <Octicons className="m-2 mt-2" name="dependabot" size={26} style={{color:'#5296a5'}} />
            <View className='bg-bg2 m-1 p-1 rounded-lg mt-2 items-center shadow shadow-gray-300'>
                <Text className='flex-1 text-left font-light m-1 p-1'>{generatedResponse}</Text>
            </View>
            <TouchableOpacity onPress={handleSave} className='mt-2 m-1'>
                {isSaved ? (<Ionicons name='bookmark' size={26} style={{ color: '#ffde21'}} />) : (<Ionicons name='bookmark-outline' size={26} style={{ color: '#ffde21'}} />)}
            </TouchableOpacity>
        </View>

        </>
    )
}

export default Response

const styles = StyleSheet.create({});