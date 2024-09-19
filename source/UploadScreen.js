import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = ({ route }) => {
  const { passengerName, passengerAge, passengerGender, fromPlace, toPlace, seatSelection, journeyDate } = route.params;
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const [activeDevice, setActiveDevice] = useState(null);
  const camera = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (devices && devices.back) {
      setActiveDevice(devices.back);
    }
  }, [devices]);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
    console.log(newCameraPermission);
  };

  const takePicture = async () => {
    try {
      if (camera.current !== null) {
        const photo = await camera.current.takePhoto();
        console.log(photo.path);
        setImageData(photo.path);
        navigation.navigate('UploadPhotoDisplay', { passengerName, imageData: photo.path, passengerAge, passengerGender, fromPlace, toPlace, seatSelection, journeyDate });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const showFloatingMessage = () => {
    setShowMessage(true);
  };

  const hideFloatingMessage = () => {
    setShowMessage(false);
  };

  const windowDimensions = Dimensions.get('window');
  const isLargeScreen = windowDimensions.width > 600;

  const dynamicStyles = StyleSheet.create({
    transparentbox: {
      width: isLargeScreen ? 580 : windowDimensions.width - 100,
      height: isLargeScreen ? 940 : windowDimensions.height - 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#3cb371',
      borderWidth: 2,
    },
    button: {
      width: isLargeScreen ? 60 : 40,
      height: isLargeScreen ? 60 : 40,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: isLargeScreen ? 30 : 20,
      marginHorizontal: isLargeScreen ? 80 : 40,
      marginLeft: isLargeScreen ? 120 : 80,
    },
    buttonIcon: {
      width: isLargeScreen ? 40 : 30,
      height: isLargeScreen ? 40 : 30,
    },
    floatingMessageText: {
      color: 'white',
      fontSize: isLargeScreen ? 22 : 14,
      flex: 1,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {showMessage && (
        <View style={styles.floatingMessageContainer}>
          <Text style={[styles.floatingMessageText]}>Make Sure you Upload a Valid Document</Text>
          <TouchableOpacity onPress={hideFloatingMessage}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
      {activeDevice ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={activeDevice}
          isActive={true}
          photo={true}
        />
      ) : (
        <Text>No camera device available.</Text>
      )}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={dynamicStyles.transparentbox} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={dynamicStyles.button}>
          <TouchableOpacity
            onPress={() => {
              showFloatingMessage();
              takePicture();
              hideFloatingMessage();
            }}
          >
            <Image source={require('./assets/Camera.png')} style={dynamicStyles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    zIndex: 9999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingMessageText: {
    color: 'white',
    flex: 1,
  },
  closeButton: {
    color: 'red',
    marginRight: 10,
    fontSize: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default UploadScreen;