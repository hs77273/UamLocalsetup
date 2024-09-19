import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditSeat = ({ route }) => {
  const { passengerName, passengerAge, passengerGender, fromPlace, toPlace, journeyDate } = route.params;
  const [newSeatSelection, setNewSeatSelection] = useState('A1');
  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const navigation = useNavigation();

  const handleSeatPress = (seat) => {
    setNewSeatSelection(seat);
  };

  const handlePopupClose = () => {
    setShowSeatPopup(false);
  };

  const handleShowSeatPopup = () => {
    setShowSeatPopup(true);
  };

  const handleProceed = () => {
    const registrationMessage = `Passenger Name: ${passengerName}\nPassenger Age: ${passengerAge}\nPassenger Gender: ${passengerGender}\nFrom Place: ${fromPlace}\nTo Place: ${toPlace}\nJourney Date: ${journeyDate}\nSeat: ${newSeatSelection}`;

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
              passengerAge,
              passengerGender,
              fromPlace,
              toPlace,
              seatSelection: newSeatSelection,
              journeyDate,
            });
          },
        },
      ],
      { cancelable: false }
    );
  };
  const windowDimensions = useWindowDimensions();

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.logoContainer, { marginBottom: windowDimensions.width > 600 ? 100 : 40 }]}>
          <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={[styles.card, { marginBottom: windowDimensions.width > 600 ? 30 : 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[
              styles.cardTitle,
              { fontSize: windowDimensions.width > 600 ? 24 : 16 },
            ]}>
              Your Details
            </Text>
          </View>
          <Text style={[styles.cardText, { fontSize: windowDimensions.width > 600 ? 20 : 16 },]}>Passenger Name: {passengerName}</Text>
          <Text style={[styles.cardText, { fontSize: windowDimensions.width > 600 ? 20 : 16 },]}>Passenger Age: {passengerAge}</Text>
          <Text style={[styles.cardText, { fontSize: windowDimensions.width > 600 ? 20 : 16 },]}>Passenger Gender: {passengerGender}</Text>
          <Text style={[styles.cardText, { fontSize: windowDimensions.width > 600 ? 20 : 16 },]}>From Place: {fromPlace}</Text>
          <Text style={[styles.cardText, { fontSize: windowDimensions.width > 600 ? 20 : 16 },]}>To Place: {toPlace}</Text>
          <Text style={[styles.cardText, { fontSize: windowDimensions.width > 600 ? 20 : 16 },]}>Journey Date: {journeyDate}</Text>
        </View>
        <TouchableOpacity
          style={[styles.selectedSeatContainer, { height: windowDimensions.width > 600 ? '5%' : '7%' }]}
          onPress={handleShowSeatPopup}
        >
          <Text style={[styles.selectedSeatText, { fontSize: windowDimensions.width > 600 ? 20 : 15.5 }]}>
            {newSeatSelection}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShowSeatPopup} style={[styles.dropdownIcon, { top: windowDimensions.width > 600 ? '60%' : '81%' },]}>
          <Image source={require('./assets/Drop_down.png')} style={styles.dropdownImage} />
        </TouchableOpacity>

        <Modal
          visible={showSeatPopup}
          animationType="slide"
          transparent={true}
        >
          <View style={[
            styles.modalContainer,
            {
              height: windowDimensions.width > 600 ? '100%' : '100%',
              width: windowDimensions.width > 600 ? '100%' : '200%',
            }
          ]}
          >
            <View style={[styles.modalContent,{
              height: windowDimensions.width > 600 ? '30%' : '50%',
              width: windowDimensions.width > 600 ? '30%' : '30%',
            }]}>
              <TouchableOpacity onPress={handlePopupClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.modaltitle}>Select Seat</Text>
              <View style={styles.popupSeatContainer}>
                <View style={styles.row}>
                  {['A1', 'B1'].map((seat) => (
                    <TouchableOpacity
                      key={seat}
                      onPress={() => handleSeatPress(seat)}
                      style={[
                        styles.popupSeatIcon,
                        {
                          borderColor: newSeatSelection === seat ? '#00008C' : 'transparent',
                          tintColor: newSeatSelection === seat ? '#00008C' : 'black',
                        },
                      ]}
                    >
                      <Image source={require('./assets/seat.png')} style={styles.popupSeatImage} />
                      <Text
                        style={[
                          styles.popupSeatText,
                          { color: newSeatSelection === seat ? '#00008C' : 'black' },
                        ]}
                      >
                        {seat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.row}>
                  {['A2', 'B2'].map((seat) => (
                    <TouchableOpacity
                      key={seat}
                      onPress={() => handleSeatPress(seat)}
                      style={[
                        styles.popupSeatIcon,
                        {
                          borderColor: newSeatSelection === seat ? '#00008C' : 'transparent',
                          tintColor: newSeatSelection === seat ? '#00008C' : 'black',
                        },
                      ]}
                    >
                      <Image source={require('./assets/seat.png')} style={styles.popupSeatImage} />
                      <Text
                        style={[
                          styles.popupSeatText,
                          { color: newSeatSelection === seat ? '#00008C' : 'black' },
                        ]}
                      >
                        {seat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={handleProceed} style={[styles.proceedButton, { height: windowDimensions.width > 600 ? '5%' : '7%', }]}>
          <Text style={[styles.buttonText, { fontSize: windowDimensions.width > 600 ? 20 : 15.5, }]}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
    width: '90%',
    alignSelf: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    width: 200,
    height: 200,
    tintColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    elevation: 3,
    color: 'black',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginRight: 30,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 20,
    marginBottom: 5,
    color: 'black',
  },
  seatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  seatIcon: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  seatImage: {
    width: 50,
    height: 50,
  },
  seatText: {
    marginTop: 5,
    fontSize: 16,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 26,
    top: '40%',
    transform: [{ translateY: -15 }],
    tintColor: '#00008C',
  },
  dropdownImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 26,
    top: '50%',
    transform: [{ translateY: -15 }],
    tintColor: '#00008C',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: '30%',
    width: '30%',
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  popupSeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  popupSeatIcon: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  popupSeatImage: {
    width: 50,
    height: 50,
  },
  popupSeatText: {
    marginTop: 5,
    fontSize: 16,
  },
  picker: {
    display: 'none',
  },
  pickerItem: {
    display: 'none',
  },
  proceedButton: {
    backgroundColor: 'white',
    height: '5%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
  selectedSeatContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: '5%',
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedSeatText: {
    fontSize: 24,
    color: 'black',
  },
  modaltitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 30,
  },
});

export default EditSeat;