import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import 'whatwg-fetch';
import "../global.css";

const TabIcon = ({focused, focused_icon, icon, title}:any) => {
    if(focused){
        return (
        <View className= "h-full w-32 items-center">  
            <Ionicons
                name = {focused_icon}
                size = {24}
                style={{color:'#5296a5'}}
            />
            <Text className='text-secondary mt-1 text-center text-sm font-medium'>{title}</Text>
        </View>)
    }
    return(
        <View className="h-full w-32 items-center">
            <Ionicons
                name={focused_icon}
                size={24}
                style={{color:'#e4e4e4'}}
            />
            <Text className='text-text mt-1 text-sm font-medium'>{title}</Text>
        </View>
    )
}

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor:"grey",
            tabBarShowLabel:false,
            tabBarItemStyle:{
                //backgroundColor:"#d3d3d3",
                width: '100%',
                height: "100%",
                justifyContent: 'center',
                alignItems: 'center'
            },
            tabBarStyle:{
                backgroundColor: '#ffffff',
                borderRadius: 0,
                marginHorizontal:0,
                marginBottom:0,
                height: 90, //height of the tab bar
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: 'white'
            },

        }}>
        {/*<Tabs.Screen 
            name="forum" 
            options={{ 
                title: 'Forum',
                headerShown:false,
                tabBarIcon:({focused}) => (
                    <TabIcon 
                        focused = {focused}
                        focused_icon= 'people-sharp' 
                        icon = 'people-outline'
                        title = 'Forum' />
                ) }} /> */}
        <Tabs.Screen 
            name="home" 
            options={{ 
                title: 'Home',
                headerShown:false,
                tabBarIcon:({focused}) => (
                    <TabIcon 
                        focused = {focused}
                        focused_icon= 'home-sharp' 
                        icon = 'home-outline'
                        title = 'Home' />
                ) }} />
        <Tabs.Screen 
            name="profile" 
            options={{ 
                title: 'Profile',
                headerShown:false,
                tabBarIcon:({focused}) => (
                    <TabIcon 
                        focused = {focused}
                        focused_icon= 'person-sharp' 
                        icon = 'person-outline'
                        title = 'Profile' />
                ) }} />
    </Tabs>
  );
}
