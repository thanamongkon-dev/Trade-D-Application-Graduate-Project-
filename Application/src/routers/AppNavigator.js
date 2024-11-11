import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import DetailScreen from '@screens/DetailScreen'
import EditPost from '@screens/EditPost'
import AuthScreen from '@screens/AuthScreen'
import RegisForm from '@components/RegisForm'
import BottomTabNavigation from './BottomTabNavigation';
import ChatRoom from "../screens/chat/ChatRoom";
import ChatRoom2 from "../screens/chat/ChatRoom2";
import { useAuth } from "../hooks/AuthContext";
import OtherProfile from '@screens/OtherProfile'
import ForgetPassword from '@screens/ForgetPassword'
import ChangePass from '@screens/ChangePass'
import CreateOffer from '@screens/CreateOffer'
import EditProfile from '@screens/EditProfile'



const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {user} = useAuth()
  // {user ? console.log(user):''}
  if(user) {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="root" screenOptions={{ headerShown: false ,tabBarVisible: false}}>
          <Stack.Screen name="root" component={BottomTabNavigation}/>
          <Stack.Screen name="Detail" component={DetailScreen}/>
          <Stack.Screen name="EditPost" component={EditPost}/>
          <Stack.Screen name="Chat2" component={ChatRoom2}/>
          <Stack.Screen name="Other" component={OtherProfile}/>
          <Stack.Screen name="CreateOffer" component={CreateOffer}/>
          <Stack.Screen name="EditProfile" component={EditProfile}/>
          <Stack.Screen name="Forget" component={ForgetPassword}/>
          <Stack.Screen name="ChangePass" component={ChangePass}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false ,tabBarVisible: false}}>
          <Stack.Screen name="Auth" component={AuthScreen}/>
          <Stack.Screen name="Forget" component={ForgetPassword}/>
          <Stack.Screen name="ChangePass" component={ChangePass}/>
          
          {/* <Stack.Screen name="RegisForm" component={RegisForm}/> */}
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
};

export default AppNavigator;
