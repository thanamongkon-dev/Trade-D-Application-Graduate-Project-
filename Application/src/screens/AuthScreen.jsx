import { View, Text ,StyleSheet,StatusBar,Image,KeyboardAvoidingView} from 'react-native'
import React, { useState,useEffect } from 'react';
import LoginForm from '@components/LoginForm'
import RegisForm from '@components/RegisForm'
import { url } from "@api";

const AuthScreen = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };
  

  return (
    
    <KeyboardAvoidingView style={styles.Container}>

      <StatusBar backgroundColor="#f96163" style="light" />
      
      {showLoginForm ? (
        <>
          <View className='mt-[80] mb-[30] '>
            <Image source={require("../TradeDLogo.png")} style={styles.Logo}/>
          </View>
          <LoginForm onSignUpPress={toggleForm} />
        </>
      ) : (
      <RegisForm onSignInPress={toggleForm} onSignUpSuccess={toggleForm} />
      )}
    </KeyboardAvoidingView>
  )
}

export default AuthScreen
const styles = StyleSheet.create({
  Container:{
    display:'flex',
    alignItems:'center',
    height:'100%',
    backgroundColor:'white'
  },
  Logo:{
    width:300,
    height:150,
    resizeMode:'contain',
    // backgroundColor:'gray'
  }
})