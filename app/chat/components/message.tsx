import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

const Message = (props) => {
    console.log(props);
    return (
        <View className='bg-gray-200 m-2 p-2 rounded-lg mt-5 flex-row items-center shadow shadow-gray-300'>
            <Text className='flex-1 text-right font-light m-1 p-1'>{props.message}</Text>
            <Ionicons name="person-circle-sharp" size={24} color="black" className="m-1" />
        </View>
    )
}

export default Message

const styles = StyleSheet.create({})