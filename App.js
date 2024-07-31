import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Nav from './src/components/Nav'
import Login from './src/screen/Login'
import ForgotPassword from './src/screen/ForgotPassword'
import Notifications from './src/screen/Notifications'
import Vehicles from './src/screen/Vehicles';
import Settings from './src/screen/Settings';
import MyAccount from './src/screen/MyAccount'
import ApiProvider from './src/api/ApiProvider'
import LoadingContextProvider from './src/components/LoadingContextProvider';
import Loading from './src/components/Loading';
import Register from './src/screen/Register'
import ChooseLanguages from './src/screen/ChooseLanguages';
import AracEkle from './src/screen/AracEkle';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Users from './src/screen/Users';
import UserAdd from './src/screen/UserAdd';
import AracEkleEdit from './src/screen/AracEkleEdit';
import UserEdit from './src/screen/UserEdit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {

  AsyncStorage.getItem("weaver:selectedLang").then((token) => {
    if (token) {
      i18n.changeLanguage(token)

    }
  })

  const Stack = createNativeStackNavigator();
  const [initialRoute, setInitialRoute] = React.useState("Login")
  const [loading, setLoading] = React.useState(false)

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

      <ApplicationProvider {...eva} theme={eva.light}>

        <NavigationContainer>

          <ApiProvider loadingCallback={setLoading} >

          </ApiProvider>

          <Loading loading={loading} />

          <Stack.Navigator initialRouteName="Login" headerMode="none" screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Login" component={Login} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="route-name" component={Nav} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="Notifications" component={Notifications} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="MyAccount" component={MyAccount} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="Vehicles" component={Vehicles} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="Settings" component={Settings} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="Register" component={Register} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="AracEkle" component={AracEkle} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="Users" component={Users} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="UserAdd" component={UserAdd} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="AracEkleEdit" component={AracEkleEdit} screenOptions={{
              headerShown: false
            }} />
            <Stack.Screen name="UserEdit" component={UserEdit} screenOptions={{
              headerShown: false
            }} />
          </Stack.Navigator>

        </NavigationContainer>

      </ApplicationProvider>

    </GestureHandlerRootView>

  );

};

export default App;