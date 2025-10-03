import Octicons from '@expo/vector-icons/Octicons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Response = (props) => {
    const [generatedResponse, setGeneratedResponse] = useState("");
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
    },[props.prompt]);
    return (
        <View className='bg-gray-200 m-2 p-2 rounded-lg mt-5 flex-row items-center shadow shadow-gray-300'>
            <Octicons className="m-1" name="dependabot" size={24} color="black" />
            <Text className='flex-1 text-left font-light m-1 p-1'>{generatedResponse}</Text>
        </View>
    )
}
export default Response

const styles = StyleSheet.create({})