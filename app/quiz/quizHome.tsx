import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function quizHome() {
    return (
        <View style={styles.scene_parent}>
            <View style={styles.back_button_parent}>
                <TouchableOpacity style={styles.back_button_touchable} onPress={() => router.push('/home')}>
                    <Text className='text-lg font-semibold' >Back</Text>
                </TouchableOpacity>
            </View>
            <Text>Quiz Home</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    scene_parent:{
        flex:1,
        backgroundColor:'#f0f0f0',
        width: '100%',
        alignContent: 'center',
        margin: 10,
    },
    back_button_parent:{
        width: 80,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#82ddf0',
    },
    back_button_touchable:{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
});