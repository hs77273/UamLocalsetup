import React, { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  Button,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';

export default function MainAppScreen({ navigation }) {
  const [apiResponse, setApiResponse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [eyeImage, setEyeImage] = useState(require('./assets/eye.png'));
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    navigation.navigate('Registration');
  };

  const logoFadeAnimation = useRef(new Animated.Value(0)).current;
  const sloganFadeAnimation = useRef(new Animated.Value(0)).current;
  const poweredByFadeAnimation = useRef(new Animated.Value(0)).current;

  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 600;

  useEffect(() => {
    const logoAnimationDuration = 1000;
    const textFadeInDuration = 1500;
    const animationDelay = 500;

    const startAnimations = () => {
      Animated.sequence([
        Animated.timing(logoFadeAnimation, {
          toValue: 1,
          duration: logoAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(sloganFadeAnimation, {
          toValue: 1,
          duration: textFadeInDuration,
          useNativeDriver: true,
        }),
        Animated.timing(poweredByFadeAnimation, {
          toValue: 1,
          duration: textFadeInDuration,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const delayTimeout = setTimeout(startAnimations, animationDelay);
    return () => clearTimeout(delayTimeout);
  }, [logoFadeAnimation, sloganFadeAnimation, poweredByFadeAnimation]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeImage(showPassword ? require('./assets/eye.png') : require('./assets/eyeslash.png'));
  };

  const handleLogin = async () => {
    if (!username) {
      Alert.alert('Field Required!', 'Username cannot be empty.');
    } else if (!password) {
      Alert.alert('Field Required!', 'Password cannot be empty.');
    } else {
      try {
        setLoading(true);
  
        const encodedUsername = encodeURIComponent(username);
        const encodedPassword = encodeURIComponent(password);
  
        const response = await fetch(`http://192.168.251.10:7071/api/login?username=${encodedUsername}&password=${encodedPassword}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const data = await response.json();
          if (data.message === 'Login successful') {
            navigation.navigate('NavigateScreen', { username, password });
            console.log('Login successful');
          } else {
            console.log('Login failed');
            Alert.alert('Login Failed', 'Invalid username or password.');
          }
        } else if (response.status === 401) {
          console.log('Login failed due to 401 status code');
          Alert.alert('Login Failed', 'Invalid username or password.');
        } else {
          console.error('Unexpected status code:', response.status);
          Alert.alert('Network Error', 'Please check your connection.');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Network request failed. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }
  };
      
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: isTablet ? 20 : 10,
    },
    TitleText: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      marginTop: 10,
    },
    title: {
      color: '#00bee2',
      fontWeight: 'bold',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    logo: {
      resizeMode: 'contain',
      marginTop: 5,
      marginBottom: 5,
      height: isTablet ? 300 : 200,
      tintColor: 'white',
    },
    inputContainer: {
      marginTop: 10,
      marginBottom: isTablet ? 20 : 40,
      color: 'white',
      position: 'relative',
    },
    input: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 1.5,
      paddingLeft: 40,
      marginBottom: 10,
      borderRadius: 5,
      color: 'white',
      fontSize: isTablet ? 20 : 18,
    },
    registerText: {
      color: '#00bee2',
      fontSize: isTablet ? 20 : 18,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      marginBottom: 15,
      paddingBottom: 5,
    },
    bottomTextContainer: {
      position: 'absolute',
      bottom: isTablet ? 30 : 20,
      alignItems: 'center',
    },
    sloganText: {
      color: '#00bee2',
      fontSize: isTablet ? 18 : 14.5,
      marginBottom: 2,
      fontWeight: 'bold',
      marginTop: isTablet ? 10 : 5,
    },
    poweredByText: {
      color: '#00bee2',
      fontSize: isTablet ? 18 : 14.5,
      fontWeight: 'bold',
    },
    loginButton: {
      backgroundColor: '#0093af',
      height: 50,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: isTablet ? 24 : 20,
    },
    passwordVisibilityButton: {
      position: 'absolute',
      right: 10,
      top: isTablet ? 75 : 70,
      zIndex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <View style={styles.container}>
            <View style={styles.TitleText}>
              <Text style={[styles.title, { fontSize: isTablet ? 40 : 30 }]}>ICMS</Text>
            </View>
            <Image source={require('./assets/logo.png')} style={[styles.logo, { width: isTablet ? 250 : 180 }]} />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { width: isTablet ? 350 : 250 }]}
                placeholder="UserName"
                placeholderTextColor="white"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              <TextInput
                style={[styles.input, { width: isTablet ? 350 : 250 }]}
                placeholder="Password"
                secureTextEntry={!showPassword}
                placeholderTextColor="white"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity style={styles.passwordVisibilityButton} onPress={togglePasswordVisibility}>
                <Image source={eyeImage} style={{ width: 20, height: 20, tintColor: 'white' }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleGetStarted}>
              <Text style={styles.registerText}>Not yet Registered! Register here</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#00bee2" style={{ marginTop: 20 }} />}
            <Animated.View style={styles.bottomTextContainer}>
              <Animated.Text style={[styles.sloganText, { opacity: sloganFadeAnimation }]}>INTELLIGENT CABIN MANAGEMENT SOLUTION</Animated.Text>
              <Animated.Text style={[styles.poweredByText, { opacity: poweredByFadeAnimation }]}>Powered By Cyient Ltd.</Animated.Text>
            </Animated.View>
            <StatusBar style="auto" />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
}  