import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const isMobile = windowWidth < 600;

const buttonContainerStyle = isMobile
  ? { marginTop: 10, alignSelf: 'center', textAlign: 'center' }
  : { marginTop: 10, alignSelf: 'center', textAlign: 'center' };

const buttonColumnStyle = isMobile
  ? { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: 'transparent', paddingHorizontal: 50, paddingVertical: 5, borderRadius: 5, marginTop: 10,marginRight: 10 }
  : { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: 'transparent', paddingHorizontal: 100, paddingVertical: 10, borderRadius: 5, marginTop: 20,marginRight: 10 };

const buttonIconStyle = isMobile
  ? { width: 50, height: 50, tintColor: '#0093af', alignSelf: 'center',marginLeft: 20 }
  : { width: 100, height: 100, tintColor: '#0093af', alignSelf: 'center',marginLeft: 140 };

const buttonIconOthersStyle = isMobile
  ? { width: 50, height: 50, tintColor: '#DE7A00', alignSelf: 'center' }
  : { width: 100, height: 100, tintColor: '#DE7A00', alignSelf: 'center' };

const buttonIconMyselfStyle = isMobile
  ? { width: 50, height: 50, tintColor: '#DE7A00', alignSelf: 'center',marginRight: 20}
  : { width: 100, height: 100, tintColor: '#DE7A00', alignSelf: 'center',marginRight: 140};

const buttonText = { fontSize: isMobile ? 16 : 22, color: 'white', fontWeight: 'bold', marginTop: 5, alignSelf: 'center', textAlign: 'center', marginBottom: 20,marginLeft: isMobile ? 40 : 140};
const buttonText1 = { fontSize: isMobile ? 16 : 22, color: 'white', fontWeight: 'bold', marginTop: 5, alignSelf: 'center', textAlign: 'center', marginBottom: 20,marginRight: isMobile ? 20: 140};

const NavigateScreen = ({ route }) => {
  const navigation = useNavigation();
  const { username, password } = route.params;

  const handleView = () => {
    navigation.navigate('PersonnelDetailScreen', { username, password });
  }

  const handleTrip = () => {
    navigation.navigate('TripScreen', { username, password });
  }

  return (
    <View style={styles.container}>
      <Image source={require('./assets/background.png')} style={styles.backgroundImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.logoText}>ICMS</Text>
        <Image source={require('./assets/logo.png')} style={styles.logoImage} />

        <View style={buttonColumnStyle}>
          <TouchableOpacity onPress={handleTrip} style={buttonContainerStyle}>
            <Image source={require('./assets/detail.png')} style={buttonIconMyselfStyle} />
            <Text style={buttonText1}>Add Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleView} style={buttonContainerStyle}>
            <Image source={require('./assets/view.png')} style={buttonIconStyle} />
            <Text style={buttonText}>View details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    fontSize: isMobile ? 32 : 42,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  logoImage: {
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 10,
    width: isMobile ? 150 : 300,
    height: isMobile ? 150 : 300,
    tintColor: '#0093af',
  },
});

export default NavigateScreen;