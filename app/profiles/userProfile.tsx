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
            router.replace('/auth/auth')
        } catch (err: any) {
            Alert.alert('Sign out error', err.message || String(err))
        }
    }

    useEffect(() => {
        let cancelled = false
        let channel: any = null
        let authSub: any = null

        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const user_id = user?.id
            if (user) setEmail(user.email || '')

            // prefer profile.username if present, otherwise use auth metadata name
            if (user_id) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user_id)
                    .maybeSingle()

                if (!cancelled) {
                    if (error) {
                        console.log('Error fetching profile:', error)
                        setName(user.user_metadata?.name || '')
                    } else if (data) {
                        setName(data.username || user.user_metadata?.name || '')
                    } else {
                        setName(user.user_metadata?.name || '')
                    }
                }

                // [handle EDIT PROFILE] listens to changes on the profile table and update UI immediately when the profile is edited
                try {
                    // use a user-specific channel name for clarity
                    channel = supabase
                        .channel(`profiles:${user_id}`)
                        // handle INSERT (row created) so newly-created profiles are captured
                        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles', filter: `id=eq.${user_id}` }, (payload) => {
                            const newName = payload?.new?.username ?? ''
                            setName(newName)
                        })
                        // handle UPDATE (row modified)
                        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user_id}` }, (payload) => {
                            const newName = payload?.new?.username ?? ''
                            setName(newName)
                        })
                        .subscribe()
                } catch (e) {
                }
            } else if (user) {
                setName(user.user_metadata?.name || '')
            }
        }

        // [handle AUTH STATE CHANGE] listen for auth state changes (sign-in, sign-out)
        try {
            authSub = supabase.auth.onAuthStateChange((event, session) => {
                const u = session?.user
                if (u) {
                    setEmail(u.email || '')
                    setName((prev) => prev || u.user_metadata?.name || '')
                }
            })
        } catch (e) {
            // ignore
        }

        fetchData()

        return () => {
            cancelled = true
            try {
                if (channel && channel.unsubscribe) channel.unsubscribe()
            } catch (e) {
                // ignore
            }
            try {
                if (authSub && authSub.data && authSub.data.subscription && authSub.data.subscription.unsubscribe) {
                    authSub.data.subscription.unsubscribe()
                }
            } catch (e) {
                // ignore
            }
        }
    }, [])

            return (
                <SafeAreaView className='flex-1 bg-bg1'>
                    <View className='items-center pt-10 px-6'>
                        <View className='rounded-full p-1 bg-primary'>
                            <View className='w-28 h-28 rounded-full bg-bg2 items-center justify-center'>
                                <Text className='text-6xl font-bold text-primary'>{(name || 'U').charAt(0)}</Text>
                            </View>
                        </View>

                        <Text className='text-2xl font-bold text-black mt-4'>{name || 'Your Name'}</Text>
                        <Text className='text-sm text-gray-600 mt-1'>{email || 'you@example.com'}</Text>

                        <View className='w-full mt-8 space-y-3'>
                            <TouchableOpacity
                                onPress={() => router.push('/profiles/editProfile')}
                                className='mt-5 last:w-full bg-secondary rounded-2xl px-4 py-3 flex-row items-center justify-between'
                            >
                                <View className='flex-row items-center'>
                                    <View className='bg-secondary rounded-lg p-3 mr-3'>
                                        <Ionicons name='create' size={24} style={{ color: '#ffffff' }} />
                                    </View>
                                    <View>
                                        <Text className='text-white font-semibold'>Edit Profile</Text>
                                        <Text className='text-white/80 text-sm'>Update your name, email and password</Text>
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
                            <TouchableOpacity
                                onPress = {signOut}>
                                    <View className='mx-auto mt-10 w-10/12 rounded-3xl bg-primary p-3'>
                                        <Text className='text-bg2 text-center font-bold text-lg'>Log Out</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            )
        }

