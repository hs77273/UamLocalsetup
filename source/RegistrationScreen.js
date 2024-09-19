import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [passengerGender, setPassengerGender] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [seatSelection, setSeatSelection] = useState('A1');
  const [journeyDate, setJourneyDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPopup, setShowGenderPopup] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male', icon: require('./assets/male.png') },
    { value: 'female', label: 'Female', icon: require('./assets/female.png') },
    { value: 'others', label: 'Others', icon: require('./assets/others.jpg') },
  ];

  const handleShowGenderPopup = () => {
    setShowGenderPopup(true);
  };

  const handleGenderPopupClose = () => {
    setShowGenderPopup(false);
  };

  const handleGenderSelect = (genderValue) => {
    setPassengerGender(genderValue);
    setShowGenderPopup(false);
  };

  const showAlert = (fieldName) => {
    if (fieldName === 'Seat Selection') {
      Alert.alert(
        'Field Required',
        `Please Select a Seat`,
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false }
      );
    } else if (fieldName === 'Success') {
      const registrationMessage = `Passenger Name: ${passengerName}\nPassenger Age: ${passengerAge}\nPassenger Gender: ${passengerGender}\nFrom Place: ${fromPlace}\nTo Place: ${toPlace}\nJourney Date: ${journeyDate.toDateString()}\nSeat: ${seatSelection}`;
      Alert.alert(
        'Verify Details!',
        registrationMessage,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: () => {
              navigation.navigate('DecideScreen', {
                passengerName,
                seatSelection,
                passengerAge,
                passengerGender,
                fromPlace,
                toPlace,
                seatSelection,
                journeyDate: journeyDate.toDateString(),
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        'Field Required',
        `Please enter ${fieldName}`,
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false }
      );
    }
  };

  const handleNext = () => {
    if (!passengerName) {
      showAlert('Passenger Name');
    } else if (!passengerAge) {
      showAlert('Passenger Age');
    } else if (!fromPlace) {
      showAlert('From Place');
    } else if (!toPlace) {
      showAlert('To Place');
    } else if (!seatSelection) {
      showAlert('Seat Selection');
    } else if (!passengerGender) {
      showAlert('Gender');
    } else if (isNaN(passengerAge) || !Number.isInteger(Number(passengerAge))){
      Alert.alert('Error!','Please Enter a valid Age')
    }else if(passengerAge >= 110 || passengerAge <= 0){
        Alert.alert('Error!','Please Enter a valid Age')
    } else {
      showAlert('Success');
    }
  };

  const handleEditSeat = () => {
    if (!passengerName) {
      showAlert('Passenger Name');
    } else if (!passengerAge) {
      showAlert('Passenger Age');
    } else if (!fromPlace) {
      showAlert('From Place');
    } else if (!toPlace) {
      showAlert('To Place');
    } else if (!passengerGender) {
      showAlert('Gender');
    } else if (isNaN(passengerAge) || !Number.isInteger(Number(passengerAge))){
      Alert.alert('Error!','Please Enter a valid Age')
    } else if(passengerAge >= 110 || passengerAge <= 0){
      Alert.alert('Error!','Please Enter a valid Age')
    } else {
      navigation.navigate('EditSeat', {
        passengerName,
        passengerAge,
        passengerGender,
        fromPlace,
        toPlace,
        seatSelection,
        journeyDate: journeyDate.toDateString(),
      });
    }
  };

  const windowDimensions = useWindowDimensions();

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.containermain}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.TitleText}>
          <Text
            style={[
              styles.title,
              { fontSize: windowDimensions.width > 600 ? 40 : 24 },
            ]}
          >
            ICMS
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={[styles.input,
            {
              height: windowDimensions.height > 800 ? 49 : 42,
            }
            ]}
            value={passengerName}
            onChangeText={setPassengerName}
            placeholder="Enter your Name"
            placeholderTextColor="#9E9E9E"
          />
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={[styles.input,
            {
              height: windowDimensions.height > 800 ? 49 : 42,
            }
            ]}
            value={passengerAge}
            onChangeText={setPassengerAge}
            keyboardType="numeric"
            placeholder="Enter your Age"
            placeholderTextColor="#9E9E9E"
          />
          <Text style={styles.label}>Gender:</Text>
          <TouchableOpacity
            onPress={handleShowGenderPopup}
            style={[styles.selectGenderButton,
            {
              height: windowDimensions.height > 800 ? 49 : 42,
            }
            ]}
          >
            <Text style={[styles.selectGenderButtonText,
            {
              fontSize: windowDimensions.width > 600 ? 22 : 18,
            }]}>
              {passengerGender ? passengerGender : 'Select Gender'}
            </Text>
            <Image
              source={require('./assets/Drop_down.png')}
              style={[
                styles.dropdownImage,
                {
                  right: windowDimensions.height > 600 ? 38 : 46,
                  top: windowDimensions.height > 600 ? '90%' : '88%',
                  transform: [{ translateY: windowDimensions.height > 600 ? -15 : -10 }],
                },
              ]}
            />

          </TouchableOpacity>
          <Text style={styles.label}>From:</Text>
          <TextInput
            style={[styles.input,
            {
              height: windowDimensions.height > 800 ? 49 : 42,
            }
            ]}
            value={fromPlace}
            onChangeText={setFromPlace}
            placeholder="Enter Depature location"
            placeholderTextColor="#9E9E9E"
          />
          <Text style={styles.label}>To:</Text>
          <TextInput
            style={[styles.input,
            {
              height: windowDimensions.height > 800 ? 49 : 42,
            }
            ]}
            value={toPlace}
            onChangeText={setToPlace}
            placeholder="Enter Destination location"
            placeholderTextColor="#9E9E9E"
          />
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.dateInput,
                {
                  width: windowDimensions.width > 600 ? '89.5%' : '79.5%',
                  height: windowDimensions.height > 800 ? 49 : 42,
                  marginTop: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ color: 'black', fontSize: 20 }}>
                {journeyDate.toDateString()}
              </Text>
              <Image
                source={require('./assets/calendar.png')}
                style={{ width: 24, height: 24, marginLeft: 10 }}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={journeyDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    setJourneyDate(date || journeyDate);
                  }
                  setShowDatePicker(false);
                }}
              />
            )}
          </View>

          <Text style={styles.label}>Seat:</Text>
          <TextInput
            style={[styles.input,
            {
              height: windowDimensions.height > 800 ? 49 : 42,
            }
            ]}
            value={seatSelection}
            onChangeText={setSeatSelection}
            editable={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleEditSeat}
            style={[
              styles.editButton,
              {
                marginRight: windowDimensions.width > 600 ? 80 : 80,
                width: windowDimensions.width > 600 ? '20%' : '30%',
                fontSize: windowDimensions.width > 600 ? 20 : 8,
              },
            ]}
          >
            <Text style={[styles.buttonText, { fontSize: windowDimensions.width > 600 ? 20 : 18 }]}>Edit Seat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.button,
              {
                marginRight: windowDimensions.width > 600 ? 0 : 0,
                width: windowDimensions.width > 600 ? '20%' : '30%',
                fontSize: windowDimensions.width > 600 ? 20 : 8,
              },
            ]}
          >
            <Text style={[styles.buttonText, { fontSize: windowDimensions.width > 600 ? 20 : 18 }]}>Proceed</Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={showGenderPopup}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent,{width: windowDimensions.width > 600 ? '60%' : '60%',}]}>
              <TouchableOpacity
                onPress={handleGenderPopupClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.modaltitle}>Select Gender</Text>
              <View style={styles.popupGenderContainer}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender.value}
                    onPress={() => handleGenderSelect(gender.value)}
                    style={[
                      styles.popupGenderIcon,
                      {
                        borderColor:
                          passengerGender === gender.value
                            ? '#00008C'
                            : 'transparent',
                      },
                    ]}
                  >
                    <Image
                      source={gender.icon}
                      style={[styles.popupGenderImage, { width: 50, height: 50 }]}
                    />
                    <Text
                      style={[
                        styles.popupGenderText,
                        {
                          color:
                            passengerGender === gender.value
                              ? '#00008C'
                              : 'black',
                        },
                      ]}
                    >
                      {gender.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 3,
    width: '95%',
    fontSize: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 6,
    color: 'black',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    fontSize: 20,
  },
  editButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignItems: 'center',
    marginRight: 80,
    fontSize: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignItems: 'center',
    fontSize: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 26,
    color: '#0093af',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  labelContainer: {
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    width: '68%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 8,
    color: 'black',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  pickerContainer: {
    marginBottom: 3,
    width: '100%',
    fontSize: 20,
  },
  pickerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 6,
    color: 'black',
    fontSize: 20,
    flex: 1,
    height: '20%',
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 12,
    top: '58%',
    transform: [{ translateY: -15 }],
    tintColor: '#00008C',
  },
  selectGenderButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 6,
    color: 'black',
    fontSize: 20,
    height: '8%',
  },
  selectGenderButtonText: {
    color: 'black',
    fontSize: 22,
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
    width: '60%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#00008C',
    marginBottom: 40,
  },
  modaltitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: 'black',
  },
  popupGenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  popupGenderIcon: {
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
  popupGenderImage: {
    width: 50,
    height: 50,
  },
  popupGenderText: {
    fontSize: 16,
    marginTop: 5,
  },
  dropdownImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 38,
    top: '90%',
    transform: [{ translateY: -15 }],
    tintColor: '#00008C',
  },
});

export default RegistrationScreen;