import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'

export default function UserProfile() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    async function signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                Alert.alert('Sign out error', error.message)
                return
            }
            router.replace('/')
        } catch (err: any) {
            Alert.alert('Sign out error', err.message || String(err))
        }
    }

    useEffect(() => {
        let cancelled = false
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const user_id = user?.id
            if (user) setEmail(user.email || '')

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user_id)
                .maybeSingle()

            if (!cancelled) {
                if (error) {
                    console.log('Error fetching profile:', error)
                } else if (data) {
                    setName(data.username || '')
                }
            }
        }
        fetchData()
        return () => {
            cancelled = true
        }
    }, [])

            return (
                <SafeAreaView className='flex-1 bg-bg1'>
                    <View className='items-center pt-10 px-6'>
                        {/* Circular avatar with primary ring */}
                        <View className='rounded-full p-1 bg-secondary'>
                            <View className='w-28 h-28 rounded-full bg-bg2 items-center justify-center'>
                                <Text className='text-4xl font-bold text-secondary'>{(name || 'U').charAt(0)}</Text>
                            </View>
                        </View>

                        <Text className='text-2xl font-bold text-black mt-4'>{name || 'Your Name'}</Text>
                        <Text className='text-sm text-gray-600 mt-1'>{email || 'you@example.com'}</Text>

                        {/* Action buttons vertical, full-width look, using secondary color */}
                        <View className='w-full mt-8 space-y-3'>
                            <TouchableOpacity
                                onPress={() => router.push('./ProfileSetup')}
                                className='mt-5 last:w-full bg-primary rounded-2xl px-4 py-3 flex-row items-center justify-between'
                            >
                                <View className='flex-row items-center'>
                                    <View className='bg-primary rounded-lg p-3 mr-3'>
                                        <Ionicons name='create' size={24} style={{ color: '#ffffff' }} />
                                    </View>
                                    <View>
                                        <Text className='text-white font-semibold'>Edit Profile</Text>
                                        <Text className='text-white/80 text-sm'>Update your name, avatar and bio</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Alert.alert('Settings', 'Open app settings here')}
                                className='mt-5 w-full bg-primary rounded-2xl px-4 py-3 flex-row items-center justify-between'
                            >
                                <View className='flex-row items-center'>
                                    <View className='bg-primary rounded-lg p-3 mr-3'>
                                        <Ionicons name='settings' size={24} style={{ color: '#ffffff' }} />
                                    </View>
                                    <View>
                                        <Text className='text-white font-semibold'>Settings</Text>
                                        <Text className='text-white/80 text-sm'>Notifications, preferences and privacy</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push('/profiles/save')}
                                className='mt-5 w-full bg-secondary rounded-2xl px-4 py-3 flex-row items-center justify-between'
                            >
                                <View className='flex-row items-center'>
                                    <View className='bg-secondary rounded-lg p-3 mr-3'>
                                        <Ionicons name='bookmark' size={24} style={{ color: '#ffffff' }} />
                                    </View>
                                    <View>
                                        <Text className='text-white font-semibold'>Saves</Text>
                                        <Text className='text-white/80 text-sm'>View your saved chats</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            )
        }

