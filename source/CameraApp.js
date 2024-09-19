import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const isMobile = windowWidth < 600;

const buttonContainerStyle = isMobile
  ? { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center', alignSelf: 'center' }
  : { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', alignSelf: 'center' };

const buttonWrapperStyle = isMobile
  ? { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginRight: 50, marginLeft: 30 }
  : { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginRight: 50, marginLeft: 30 };

  const buttonStyle = isMobile
  ? { width: 60, height: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 30, marginHorizontal: 40, marginLeft: 100 }
  : { width: 60, height: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 30, marginHorizontal: 80, marginLeft: 120 };

const buttonIconStyle = isMobile ? { width: 40, height: 40 } : { width: 40, height: 40 };

const FloatingMessage = ({ message, onClose }) => (
  <View style={styles.floatingMessageContainer}>
    <Text style={styles.floatingMessageText}>{message}</Text>
    <TouchableOpacity onPress={onClose}>
      <Text style={styles.closeButton}>Close</Text>
    </TouchableOpacity>
  </View>
);

const CameraApp = ({ route }) => {
  const { passengerName, passengerAge, passengerGender, fromPlace, toPlace, seatSelection, journeyDate } = route.params;
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [showMessage, setShowMessage] = useState(true);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 1 && !alertShown) {
      setAlertShown(true);
      Alert.alert(
        'Multiple Faces Detected!',
        'You can register only one person at a time.',
        [{ text: 'OK', onPress: () => setAlertShown(false) }]
      );
    }
    setIsFaceDetected(faces.length === 1);
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        setImageData(data.uri);
        if (isFaceDetected) {
          navigation.navigate('PhotoDisplay', { passengerName, imageData: data.uri, passengerAge, passengerGender, fromPlace, toPlace, seatSelection, journeyDate });
        } else if (!isFaceDetected && !alertShown) {
          setAlertShown(true);
          Alert.alert(
            'Face Not Detected',
            'Make sure your face is visible in screen.',
            [{ text: 'OK', onPress: () => setAlertShown(false) }]
          );
        }
      } else if (!alertShown) {
        setAlertShown(true);
        Alert.alert(
          'Face Not Detected',
          'Make sure your face is visible in screen.',
          [{ text: 'OK', onPress: () => setAlertShown(false) }]
        );
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const switchCamera = () => {
    setIsFrontCamera(prevState => !prevState);
  };

  return (
    <View style={{ flex: 1 }}>
      {showMessage && (
        <FloatingMessage
          message="Capture your Face"
          onClose={() => setShowMessage(false)}
        />
      )}
      <RNCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        type={isFrontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
        onFacesDetected={handleFacesDetected}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Face detection is active</Text>
      </View>
      <View style={buttonContainerStyle}>
        <View style={buttonWrapperStyle}>
        <View>
            <TouchableOpacity
              style={buttonStyle}
              onPress={switchCamera}
            >
              <Image
                source={require('./assets/Switch_camera.png')}
                style={[buttonIconStyle, { tintColor: '#ff8c00' }]}
              />
            </TouchableOpacity>
            <Text style={styles.IconText}>Swap Camera</Text>
          </View>
          <View>
            <TouchableOpacity
              style={buttonStyle}
              onPress={takePicture}
            >
              <Image source={require('./assets/Camera.png')} style={buttonIconStyle} />
            </TouchableOpacity>
            <Text style={styles.IconText}>Capture</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    width: isMobile ? 300 : 600,
    height: isMobile ? 300 : 600,
    borderRadius: isMobile ? 150 : 300,
    borderWidth: 2,
  },
  buttonContainer: buttonContainerStyle,
  buttonsWrapper: buttonWrapperStyle,
  button: buttonStyle,
  buttonIcon: buttonIconStyle,
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
    flex: 1,
    color: 'white',
    fontSize: 20,
  },
  closeButton: {
    color: 'red',
    marginRight: 10,
    fontSize: 20,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  overlayText: {
    color: 'white',
  },
  IconText: {
    fontSize: 10,
    color: 'white', 
    textAlign: 'center', 
    left: isMobile ? 90: 100,
    backgroundColor: '#00000080',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
    width: '40%'
  }
});

export default CameraApp;