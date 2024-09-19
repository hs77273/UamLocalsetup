import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DecideScreen = ({ route }) => {
    const navigation = useNavigation();
    const { passengerName, passengerAge, passengerGender, fromPlace, toPlace, seatSelection, journeyDate } = route.params;
    const windowDimensions = useWindowDimensions();

    const handleCapture = () => {
        navigation.navigate('CameraApp', {
            passengerName,
            seatSelection,
            passengerAge,
            passengerGender,
            fromPlace,
            toPlace,
            seatSelection,
            journeyDate,
        });
    }

    const handleUpload = () => {
        navigation.navigate('UploadScreen', {
            passengerName,
            seatSelection,
            passengerAge,
            passengerGender,
            fromPlace,
            toPlace,
            seatSelection,
            journeyDate,
        });
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backgroundImage: {
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
        },
        contentContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoText: {
            fontSize: windowDimensions.width > 600 ? 42 : 24,
            fontWeight: 'bold',
            color: '#00bee2',
            marginTop: 20,
            marginBottom: 20,
        },
        logoImage: {
            resizeMode: 'contain',
            marginTop: 20,
            marginBottom: 20,
            width: windowDimensions.width > 600 ? 300 : 150,
            height: windowDimensions.width > 600 ? 300 : 150,
            tintColor: 'white',
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: windowDimensions.width > 600 ? '80%' : '100%',
            marginTop: 20,
        },
        buttonContainer: {
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: 'transparent',
            paddingHorizontal: windowDimensions.width > 600 ? 100 : 50,
            paddingVertical: 10,
            borderRadius: 5,
            marginLeft: windowDimensions.width > 600 ? 30 : 15,
            marginTop: windowDimensions.height > 600 ? 40 : 20,
        },
        buttonIcon: {
            width: windowDimensions.width > 600 ? 100 : 50,
            height: windowDimensions.width > 600 ? 100 : 50,
        },
        buttonText: {
            fontSize: windowDimensions.width > 600 ? 22 : 14,
            color: 'white',
            fontWeight: 'bold',
            marginTop: 10,
        },
        footerText: {
            color: '#00bee2',
            fontSize: windowDimensions.width > 600 ? 22 : 14,
            marginBottom: 5,
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: windowDimensions.height > 600 ? 100 : 50,
            marginLeft: windowDimensions.width > 600 ? 20 : 10,
        }
    });

    return (
        <View style={styles.container}>
            <Image source={require('./assets/background.png')} style={styles.backgroundImage} />

            <View style={styles.contentContainer}>
                <Text style={styles.logoText}>ICMS</Text>
                <Image source={require('./assets/logo.png')} style={styles.logoImage} />

                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={handleUpload} style={styles.buttonContainer}>
                        <Image source={require('./assets/upload.png')} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Upload File</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCapture} style={styles.buttonContainer}>
                        <Image source={require('./assets/Camera.png')} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Capture Photo</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.footerText}>Upload a Valid Identity Document or Capture your Face</Text>
            </View>
        </View>
    );
};

export default DecideScreen;