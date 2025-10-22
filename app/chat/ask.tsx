import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import '../global.css'
import BasicUsageExample from './components/emoji-feedback-example'
import Message from './components/message'
import Response from './components/response'
import EmojiFeedbackComponent from './components/emoji-feedback'


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
    const handleKeywordMatch = (keyword: string, feedback: { message: string }) => {
    // 可以在这里添加你的业务逻辑
    console.log(`用户输入了关键词: ${keyword}`);
    console.log(`系统回复: ${feedback.message}`);
    };
    return (
        <SafeAreaView className='flex-1 bg-tertiary'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 10}
                className='flex-1'
            >
              
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

                <View className='mt-3 h-72 mx-auto'>
                    <EmojiFeedbackComponent 
                        onKeywordMatch={handleKeywordMatch}/>
                </View>

                <View className='flex-1 px-4'>
                    {myData.length === 0 ? (
                        <View className='flex-1 items-center justify-center'>
                            <Text className='text-gray-400'>start the conversation</Text>
                        </View>
                    ) : (
                                    <FlatList<string>
                                        data={[...myData].reverse()}
                                        keyExtractor={(_item: string, index: number) => index.toString()}
                                        keyboardShouldPersistTaps='handled'
                                        contentContainerStyle={{ paddingBottom: 140 }}
                                        renderItem={({ item }: { item: string }) => (
                                            <View className='mt-1'>
                                                <View >
                                                    <Message message={item} />
                                                </View>
                                                <View>
                                                    <Response prompt={item} />
                                                </View>
                                            </View>
                                        )}
                                    />
                    )}
                </View>
                {/* Composer (placed in normal layout so KeyboardAvoidingView can move it) */}
                <View className='px-4 py-4'>
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
