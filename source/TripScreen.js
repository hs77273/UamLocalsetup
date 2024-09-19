import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TripScreen = ({ route }) => {
    const { username, password } = route.params;
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [fullImageVisible, setFullImageVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [fromPlace, setFromPlace] = useState('');
    const [toPlace, setToPlace] = useState('');
    const [seatSelection, setSeatSelection] = useState('A1');
    const [journeyDate, setJourneyDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const requestData = {
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
      }, [password]);

    const handleBack = () => {
        navigation.goBack();
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
            const registrationMessage = `Passenger Name: ${data[0].passengerName}\nPassenger Age: ${data[0].passengerAge}\nPassenger Gender: ${data[0].passengerGender}\nFrom Place: ${fromPlace}\nTo Place: ${toPlace}\nJourney Date: ${journeyDate.toDateString()}\nSeat: ${seatSelection}`;
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
                                passengerName: data[0].passengerName,
                                seatSelection,
                                passengerAge: data[0].passengerAge,
                                passengerGender: data[0].passengerGender,
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
        if (!fromPlace) {
            showAlert('From Place');
        } else if (!toPlace) {
            showAlert('To Place');
        } else if (!seatSelection) {
            showAlert('Seat Selection');
        } else {
            showAlert('Success');
        }
    };

    const handleEditSeat = () => {
        if (!fromPlace) {
            showAlert('From Place');
        } else if (!toPlace) {
            showAlert('To Place');
        } else {
            navigation.navigate('EditSeat', {
                passengerName: data[0].passengerName,
                passengerAge: data[0].passengerAge,
                passengerGender: data[0].passengerGender,
                fromPlace,
                toPlace,
                seatSelection,
                journeyDate: journeyDate.toDateString(),
            });
        }
    };

    const windowDimensions = useWindowDimensions();


    return (
        <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage}>
            <ScrollView style={styles.container}>
                <Text style={styles.titletext}>Add Trip</Text>
                <View style={styles.imageContainer}>
                    {imageData && (
                        <View style={styles.circularImage}>
                            <Image source={{ uri: `data:image/jpeg;base64,${imageData}` }} style={styles.image} />
                        </View>
                    )}
                    <Text style={styles.textwelcome}>Welcome!</Text>
                </View>

                {data && data.length > 0 && (
                    <View>
                        <View style={styles.card}>
                            <View style={styles.cardContent}>
                                <Text style={styles.title}>Profile</Text>
                                <Text style={styles.text}>Name: {data[0].passengerName}</Text>
                                <Text style={styles.text}>Age: {data[0].passengerAge}</Text>
                                <Text style={styles.text}>Gender: {data[0].passengerGender}</Text>
                            </View>
                        </View>
                    </View>
                )}
                {!imageLoaded && !data ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0093af" style={styles.customActivityIndicator} />
                    </View>
                ) : null}
                <Text style={[styles.label, { marginLeft: windowDimensions.width > 600 ? 30 : 20 }]}>From:</Text>
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
                <Text style={[styles.label, { marginLeft: windowDimensions.width > 600 ? 30 : 20 }]}>To:</Text>
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
                    <Text style={[styles.label, { marginLeft: windowDimensions.width > 600 ? 30 : 20 }]}>Date:</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={[
                            styles.dateInput,
                            {
                                width: windowDimensions.width > 600 ? '83%' : '70%',
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

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleEditSeat}
                        style={[
                            styles.editButton,
                            { marginRight: windowDimensions.width > 600 ? 80 : 80,
                            width: windowDimensions.width > 600 ? '20%' : '30%', },
                        ]}
                    >
                        <Text style={[styles.buttonText, { fontSize: windowDimensions.width > 600 ? 20 : 18 }]}>Edit Seat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} style={[
                        styles.button,
                        {
                            marginRight: windowDimensions.width > 600 ? 0 : 0,
                            width: windowDimensions.width > 600 ? '20%' : '30%',
                            fontSize: windowDimensions.width > 600 ? 20 : 8,
                        },
                    ]}>
                        <Text style={[styles.buttonText, { fontSize: windowDimensions.width > 600 ? 20 : 18 }]}>Proceed</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.buttonTextb}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground >
    );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 20,
    },
    cardContainer: {
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'flex-end',
        marginTop: -40,
        textAlign: 'center',
        marginRight: 20,
    },
    circularImage: {
        width: 120,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        marginBottom: 20,
    },
    card: {
        width: windowWidth - 80,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 40,
        marginTop: 10,
        elevation: 3,
        alignSelf: 'center',
    },
    cardContent: {
        padding: 16,
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
        color: 'black',
    },
    textwelcome: {
        fontSize: 18,
        marginBottom: 5,
        color: 'white',
        textAlign: 'center',
        marginLeft: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    titletext: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        color: 'white',
        alignSelf: 'center',
        marginTop: 30,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        backgroundColor: '#0093af',
        height: 50,
        width: '30%',
        marginTop: 40,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
    },
    buttonTextb: {
        color: 'white',
        fontSize: 24,
    },
    customActivityIndicator: {
        width: 100,
        height: 100,
    },
    labelContainer: {
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    dateInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 10,
        color: 'black',
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        color: 'black',
        fontSize: 20,
        width: '92%',
        alignSelf: 'center',
    },
    label: {
        marginLeft: 30,
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
        alignSelf: 'center',
        marginTop: 20,
    },
    editButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        width: '20%',
        alignItems: 'center',
        marginRight: 10,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        width: '20%',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TripScreen;