import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainAppScreen from './source/MainAppScreen';
import RegistrationScreen from './source/RegistrationScreen';
import EditSeat from './source/EditSeat';
import CameraApp from './source/CameraApp';
import PhotoDisplay from './source/PhotoDisplay';
import PersonnelDetailScreen from './source/PersonnelDetailScreen';
import DecideScreen from './source/DecideScreen';
import NavigateScreen from './source/NavigateScreen';
import TripScreen from './source/TripScreen';
import UploadScreen from './source/UploadScreen';
import UploadPhotoDisplay from './source/UploadPhotoDisplay';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={MainAppScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="EditSeat" component={EditSeat} />
        <Stack.Screen name="CameraApp" component={CameraApp} />
        <Stack.Screen name="PhotoDisplay" component={PhotoDisplay} />
        <Stack.Screen name="PersonnelDetailScreen" component={PersonnelDetailScreen} />
        <Stack.Screen name="DecideScreen" component={DecideScreen} />
        <Stack.Screen name="NavigateScreen" component={NavigateScreen} />
        <Stack.Screen name="TripScreen" component={TripScreen} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen name="UploadPhotoDisplay" component={UploadPhotoDisplay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;