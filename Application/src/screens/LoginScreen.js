import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../hooks/useAuth';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Basic input validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    const result = await login(email, password);

    if (result.error) {
      console.error('Login failed:', result.error);
      Alert.alert('Login Error', result.error);
    } else {
      console.log('Login successful');
      navigation.navigate("root");
      // Navigate to the main app screen or perform other actions
    }
  };

  return (
    <View className='flex-1 self-center mt-20'>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
