import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function quizHome() {
    return (
        <View style={styles.scene_parent}>
            <View style={styles.back_button_parent}>
                <TouchableOpacity style={styles.back_button_touchable} onPress={() => router.push('/home')}>
                    <Text className='text-white text-lg font-semibold' >Back</Text>
                </TouchableOpacity>
            </View>
            <View style={{height: "10%"}}></View>
            <View style={styles.quiz_block_parent}>
                <Text style={styles.quiz_title_text}>Major Recommendation Quiz</Text>
                <Text className='text-base font-normal text-center mt-4 mx-4 text-gray-700'>Answer a few questions to get personalized major and career recommendations tailored to your interests and strengths.</Text>
                <TouchableOpacity
                    className='mt-8 bg-primary rounded-2xl p-3 px-6'
                    onPress={() => router.push('/quiz/quizQuestions')}
                >
                    <Text className='text-white text-lg font-semibold'>Start Quiz</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scene_parent:{
        flex:1,
        backgroundColor:'#f0f0f0',
        width: '100%',
        alignContent: 'center',
    },
    back_button_parent:{
        width: 80,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#82ddf0',
        marginTop: 60,
        marginBottom: 5,
        marginLeft: 20,
        padding: 5,
    },
    back_button_touchable:{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    quiz_title_text:{
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: '5%',
        marginTop: '2%',
        padding: 30,
    },
    quiz_block_parent:{
        alignItems: 'center',
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
        height: "50%",
        marginHorizontal: "5%",
    },
});