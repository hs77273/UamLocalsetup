import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: windowWidth < 600 ? 10 : 20,
  },
  card: {
    width: windowWidth - (windowWidth < 600 ? 40 : 80),
    padding: windowWidth < 600 ? 10 : 16, 
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    elevation: 3,
    alignSelf: 'center',
  },
  text: {
    fontSize: windowWidth < 600 ? 16 : 20,  
    marginBottom: windowWidth < 600 ? 5 : 10, 
    color: 'black',
  },
  title: {
    fontSize: windowWidth < 600 ? 20 : 24,
    fontWeight: 'bold',
    marginBottom: windowWidth < 600 ? 5 : 10,
    color: 'black',
  },
  titletext: {
    fontSize: windowWidth < 600 ? 24 : 30, 
    fontWeight: 'bold',
    marginBottom: windowWidth < 600 ? 5 : 15,
    marginTop: windowWidth < 600 ? 5 : 15,
    color: 'white',
    alignSelf: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  image: {
    width: windowWidth < 600 ? '100%' : '100%', 
    height: windowWidth < 600 ? 350 : 700, 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: windowWidth < 600 ? 5 : 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowWidth < 600 ? 5 : 10,
  },
  backButton: {
    backgroundColor: '#0093af',
    height: windowWidth < 600 ? 40 : 50, 
    width: windowWidth < 600 ? '40%' : '30%',
    marginTop: windowWidth < 600 ? 5 : 10, 
    marginBottom: windowWidth < 600 ? 20 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: windowWidth < 600 ? 18 : 24,
  },
  customActivityIndicator: {
    width: 100,
    height: 100,
  },
});

const PersonnelDetailScreen = ({ route }) => {
  const { username, password } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const requestData = {
      username: username,
      password: password,
    };
  
    fetch('http://192.168.251.10:7071/api/fetch_passenger_details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then((responseData) => {
        setData(responseData.passenger_details);
  
        if (responseData.passenger_details && responseData.passenger_details.length > 0) {
          setImageData(responseData.passenger_details[0].passengerImage);
          setImageLoaded(true);
        } else {
          Alert.alert('No Data Found', 'Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        Alert.alert('Network Error', 'Please check your network connection and try again later.');
      });
  }, [username, password]);
  
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <Text style={styles.titletext}>Journey Details</Text>
        {data &&
          data.map((item, index) => (
            <View key={index}>
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>My Journey Details</Text>
                  <Text style={styles.text}>Name: {item.passengerName}</Text>
                  <Text style={styles.text}>Age: {item.passengerAge}</Text>
                  <Text style={styles.text}>Gender: {item.passengerGender}</Text>
                  <Text style={styles.text}>From Place: {item.fromPlace}</Text>
                  <Text style={styles.text}>To Place: {item.toPlace}</Text>
                  <Text style={styles.text}>Your Seat: {item.passengerSeat}</Text>
                  <Text style={styles.text}>Journey Date: {item.journeyDate}</Text>
                </View>
              </View>
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>My photo</Text>
                  <Image source={{ uri: `data:image/jpeg;base64,${item.passengerImage}` }} style={styles.image} />
                </View>
              </View>
            </View>
          ))}
        {(!imageLoaded && !data) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0093af" style={styles.customActivityIndicator}/>
          </View>
        )}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default PersonnelDetailScreen;