import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function quizEnd() {

    const handleFinish = () => {
        router.push('/home');
    };

    const handleGoBack = () => {
        router.push('/quiz/quizQuestions');   
    };

    return (
        <View style={styles.scene_parent}>
            <View style={styles.scene_child}>
                <Text style={styles.scene_title}>Quiz Completed!</Text>
                <View style={styles.button_container}>
                    <TouchableOpacity style={styles.scene_button} onPress={handleGoBack}>
                        <Text style={styles.scene_button_text}>Go Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scene_button} onPress={handleFinish}>
                        <Text style={styles.scene_button_text}>Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scene_parent:{
        flex:1,
        backgroundColor:'#f0f0f0',
        justifyContent:'center',
    },
    scene_child:{
        height: "50%",
        marginHorizontal: '5%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
    },
    scene_title:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    scene_button:{
        marginTop: 20,
        backgroundColor: '#82ddf0',
        padding: 12,
        borderRadius: 8,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scene_button_text:{
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    button_container:{
        flexDirection: 'row',
        gap: 20,
    },
});