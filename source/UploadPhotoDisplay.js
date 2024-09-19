import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const isMobile = windowWidth < 600;

const buttonContainerStyle = isMobile
  ? { marginTop: 10, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 22 }
  : { marginTop: 10, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 };

const registerButtonStyle = isMobile
  ? { width: '48%', height:'130%', backgroundColor: '#0093af',borderRadius: 5, alignItems: 'center',marginEnd: '10%',textAlign: 'center',padding: 2}
  : { width: '48%', backgroundColor: '#0093af', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center' };

const editButtonStyle = isMobile
  ? { width: '48%', height:'130%', backgroundColor: '#0093af',borderRadius: 5, alignItems: 'center',marginEnd: '10%', textAlign: 'center',padding: 2}
  : { width: '48%', backgroundColor: '#0093af', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center' };

const buttonText = isMobile ?{ color: 'white', fontSize: 16 }:{ color: 'white', fontSize: 20 };

const imageStyle = isMobile ? { width: 200, height: 200, resizeMode: 'cover', marginBottom: 25 } : { width: 300, height: 300, resizeMode: 'cover', marginBottom: 25 };

const UploadPhotoDisplay = ({ route }) => {
  const { passengerName, passengerAge, passengerGender, fromPlace, toPlace, seatSelection, journeyDate, imageData } = route.params;
  const navigation = useNavigation();
  const initialPassword = `${passengerName}@${passengerAge}`;
  const [showAlert, setShowAlert] = useState(true);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState(initialPassword);

  const handleRetake = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    try {
      const fileExists = await RNFS.exists(imageData);

      if (!fileExists) {
        Alert.alert('Error', 'Image file not found.');
        return;
      }
      const formData = new FormData();
      formData.append('passengerName', passengerName);
      formData.append('passengerAge', passengerAge.toString());
      formData.append('passengerGender', passengerGender);
      formData.append('fromPlace', fromPlace);
      formData.append('toPlace', toPlace);
      formData.append('seatSelection', seatSelection);
      formData.append('journeyDate', journeyDate);
      formData.append('imageData', {
        uri: 'file://' + imageData,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      formData.append('password', newPassword);

      const response = await fetch('http://192.168.225.10:5000/register_passenger', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowAlert(false);
        Alert.alert('Success', 'Registered Successfully!');
      } else {
        Alert.alert('Failed', 'Registration failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  const handleEditPassword = () => {
    setEditPasswordVisible(true);
  };

  const handleSavePassword = () => {
    setEditPasswordVisible(false);
    setNewPassword(newPassword);
  };

  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.cyicmsText}>ICMS</Text>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.card}>
          {showAlert && (
            <Text style={styles.alertText}>Please note your password and click Register, you can also edit your password</Text>
          )}
          <Text style={styles.cardText}>Thank you!{passengerName}</Text>
          <Text style={styles.cardText}>username:{passengerName},password:{newPassword}</Text>
          <Image source={{ uri: 'file://' + imageData }} style={imageStyle} />
          <View style={buttonContainerStyle}>
            <View style={styles.button}>
              <TouchableOpacity style={editButtonStyle} onPress={handleEditPassword}>
                <Text style={buttonText}>Edit Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={registerButtonStyle} onPress={handleRegister}>
                <Text style={buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={editPasswordVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditPasswordVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Password</Text>
            <TextInput
              style={styles.textInput}
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
              <Text style={buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditPasswordVisible(false)}>
              <Text style={buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    width: isMobile ? '80%' : '65%',
    height: isMobile ? '55%' : '50%',
  },
  alertText: {
    color: '#0093af',
    fontSize: isMobile ? 14 : 18,
    marginBottom: isMobile ? 5 : 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardText: {
    fontSize: isMobile ? 14 : 18,
    marginBottom: isMobile ? 5 : 10,
    color: 'black',
    padding: isMobile ? 2 : 5,
    alignContent: 'center',
  },
  image: imageStyle,
  buttonContainer: buttonContainerStyle,
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isMobile ? '100%' : 'auto',
  },
  editButton: editButtonStyle,
  registerButton: registerButtonStyle,
  buttonText: buttonText,
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: isMobile ? 5 : 10,
    marginBottom: isMobile ? 5 : 10,
  },
  cyicmsText: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: 'bold',
    color: '#0093af',
    marginBottom: isMobile ? 5 : 10,
  },
  logo: {
    width: isMobile ? 120 : 180,
    height: isMobile ? 120 : 180,
    resizeMode: 'contain',
    marginTop: isMobile ? 5 : 10,
    marginBottom: isMobile ? 10 : 20,
    tintColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  textInput: {
    width: '100%',
    height: 45,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: isMobile ? 14 : 18,
  },
  saveButton: {
    backgroundColor: '#0093af',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
});
export default UploadPhotoDisplay;