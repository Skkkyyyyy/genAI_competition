import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import '../global.css'
import Message from './components/message'
import Response from './components/response'


export default function ask() {
    const [text, setText] = useState('')
    const [myData, setMyData] = useState<string[]>([])
    const router = useRouter()

    const SearchInput = () => {
        if (text.trim().length !== 0) {
            setMyData((prevData) => [text, ...prevData])
            setText('')
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-tertiary'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
                {/* Header */}
                <View className='flex-row items-center justify-between px-4 py-3'>
                    <View className='flex-row items-center'>
                        <TouchableOpacity onPress={() => router.back()} className='p-2 mr-2'>
                            <AntDesign name='left' size={22} style={{ color: '#111827' }} />
                        </TouchableOpacity>
                        <View>
                            <Text className='text-2xl font-bold'>Chats</Text>
                        </View>
                    </View>
                </View>

                {/* Compact profile / hero */}
                <View className='mx-4 my-3 rounded-2xl bg-primary p-4'>
                    <Text className='text-center text-white text-lg font-bold'>LITTLE MATTHEW</Text>
                    <Text className='text-center text-white text-sm mt-1'>A friendly career coach</Text>
                </View>

                {/* Message list */}
                <View className='flex-1 px-4'>
                    {myData.length === 0 ? (
                        <View className='flex-1 items-center justify-center'>
                            <Text className='text-gray-400'>No messages yet — start the conversation</Text>
                        </View>
                    ) : (
                                    <FlatList<string>
                                        data={myData}
                                        keyExtractor={(_item: string, index: number) => index.toString()}
                                        renderItem={({ item }: { item: string }) => (
                                            <View className='mb-4'>
                                                <View className='bg-bg2 rounded-2xl p-3'>
                                                    <Message message={item} />
                                                </View>
                                                <View className='mt-2'>
                                                    <Response prompt={item} />
                                                </View>
                                            </View>
                                        )}
                                        inverted={true}
                                        contentContainerClassName='pb-36 pt-2'
                                    />
                    )}
                </View>

                {/* Composer */}
                <View className='absolute left-0 right-0 bottom-4 px-4'>
                    <View className='flex-row items-center bg-white rounded-full p-2 shadow-lg'>
                        <TouchableOpacity className='p-2'>
                            <Ionicons name='add' size={22} style={{ color: '#0f7d80' }} />
                        </TouchableOpacity>
                        <TextInput
                            className='flex-1 px-3 text-black'
                            placeholder='Write your message...'
                            value={text}
                            onChangeText={setText}
                            returnKeyType='send'
                            onSubmitEditing={SearchInput}
                        />
                        <TouchableOpacity onPress={SearchInput} className='bg-primary rounded-full p-3 ml-2'>
                            <Ionicons name='send' size={20} style={{ color: '#fff' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
