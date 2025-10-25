import AntDesign from '@expo/vector-icons/AntDesign'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/frontend_supa'

const editProfile = () => {
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    useEffect(() => {
        const fetchUserData = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user){
                setEmail(user?.email || '');
                setNickname(user.user_metadata?.name || '');
            }
        }
        fetchUserData();
    }, []);

    const changeEmail = async (email:string) => {
        const {data, error} = await supabase.auth.updateUser({
            email: email
        })
    }

    const changeName = async (nickname:string) => {
        const {data, error} = await supabase.auth.updateUser({
            data:{name:nickname}
        })
    }

    // Change password for an authenticated user, verifying the old password first
    const changePassword = async (oldPwd: string, newPwd: string, confirmPwd: string) => {
        if (!oldPwd) {
            Alert.alert('Error', 'Please enter your current password')
            return
        }
        if (!newPwd || newPwd.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters')
            return
        }
        if (newPwd !== confirmPwd) {
            Alert.alert('Error', "New passwords don't match")
            return
        }

        try {
            // Verify current password by attempting to sign in with it.
            // This will replace the session with a fresh one for the same user if successful,
            const signin = await supabase.auth.signInWithPassword({ email, password: oldPwd })
            if (signin.error) {
                Alert.alert('Current password incorrect', signin.error.message)
                return
            }

            // Now update the password
            const { data, error } = await supabase.auth.updateUser({ password: newPwd })
            if (error) {
                Alert.alert('Password change error', error.message)
                return
            }
            Alert.alert('Success', 'Password updated')
            // clear sensitive fields
            setPassword('')
            setCurrentPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            Alert.alert('Password change error', err.message || String(err))
        }
    }

  return (
    <SafeAreaView className='bg-bg1 h-full w-full'>
        <View className='flex-row items-center justify-between px-4 py-3'>
            <View className='flex-row items-center'>
                <TouchableOpacity onPress={() => router.back()} className='p-2 mr-2'>
                    <AntDesign name='left' size={22} style={{ color: '#111827' }} />
                </TouchableOpacity>
                <View>
                    <Text className='text-2xl font-bold'>Edit Profile</Text>
                </View>
            </View>
        </View>
        <View className='w-full mt-10 px-6'>
            <Text className="font-medium text-lg">Nickname</Text>
            <TextInput
                placeholder={nickname}
                value={nickname}
                onChangeText={setNickname}
                onSubmitEditing={() => changeName (nickname)}
                className = "border border-primary rounded-2xl p-3 mt-1 text-gray-500"

            />
        </View>
        <View className='w-full mt-5 px-6'>
            <Text className="font-medium text-lg">Email Address</Text>
            <TextInput
                placeholder={email}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing = {() => changeEmail (email)}
                className = "border border-primary rounded-2xl p-3 mt-1 text-gray-500"
            />
        </View>
        <View className='w-full mt-5 px-6'>
            <Text className="font-medium text-lg">Password</Text>
            <Text className='mt-2 font-light text-sm'>Current Password</Text>
            <TextInput
                secureTextEntry={true}
                placeholder='Current password'
                value={currentPassword}
                onChangeText={setCurrentPassword}
                className = "border border-primary rounded-2xl p-3 mt-1 text-gray-500"
            />
            <Text className='mt-2 font-light text-sm'>New Password</Text>
            <TextInput
                secureTextEntry={true}
                placeholder='New password'
                value={password}
                onChangeText={setPassword}
                className = "border border-primary rounded-2xl p-3 mt-1 text-gray-500"
            />
            <Text className='mt-2 font-light text-sm'>Confirm New Password</Text>
            <TextInput
                secureTextEntry={true}
                placeholder='Confirm new password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onSubmitEditing={() => changePassword(currentPassword, password, confirmPassword)}
                className = "border border-primary rounded-2xl p-3 mt-1 text-gray-500"
            />
            <View className='flex-row space-x-3 mt-5'>
                <TouchableOpacity onPress={() => changePassword(currentPassword, password, confirmPassword)} className='bg-secondary rounded-2xl px-4 py-2'>
                    <Text className='text-white'>Change password</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default editProfile