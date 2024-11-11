import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Picker
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    Ionicons ,Feather 
  } from "@expo/vector-icons";

import { useAuth } from '../hooks/AuthContext';
import {SelectList} from 'react-native-dropdown-select-list';


const RegisForm = ({ onSignInPress }) => {
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    gender: 'Male',
    phone: "",
    location: "",
  });
  const genderOptions = [
    { key: 'Male', value: 'Male' },
    { key: 'Female', value: 'Female' },
    { key: 'Other', value: 'Other' },
  ];
  const { register } = useAuth();
  const navigation = useNavigation();

  
  const handleSignUp = async () => {
    if (
        !registerForm.email.trim() ||
        !registerForm.password.trim() ||
        !registerForm.name.trim() ||
        !registerForm.gender.trim() ||
        !registerForm.phone.trim() ||
        !registerForm.location.trim()
      ) {
        // Display an error message or handle invalid form input
        alert("กรุณากรอกข้อมูลให้ครบ")
        return;
      }
  
      // Call the register function from the useAuth context
      const result = await register(registerForm);
  
      if (result.error) {
        console.error('Registration failed:', result.error);
        // Display an error message or handle registration failure
      } else {
        console.log('Registration successful');
        onSignInPress()
        // Navigate to the login screen or perform other actions
      }
  };

  return (
    //container
    <View className="w-full h-auto p-5 items-center mt-[80]">
      {/* form container */}
      <View className="rounded-xl w-full p-5 self-center gap-3">
        <Text className="font-bold text-center text-amber-950 text-[42px] ">
          Register
        </Text>

          <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
            <Feather name="mail" size={24} color="#F96163" />
            <TextInput
              placeholder="Email"
              value={registerForm.email}
              onChangeText={(text) => setRegisterForm({ ...registerForm, email: text })}
              onBlur={() => {
                const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailFormat.test(registerForm.email) && registerForm.email !== "") {
                  // Provide feedback for wrong email format
                  alert("รูปแบบอีเมลไม่ถูกต้อง");
                }
              }}
              className="ml-2 text-md md:text-xl h-12 w-[85%]"
              autoFocus={true}
            />
          </View>

        <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
          <Feather name="lock" size={24} color="#F96163" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={registerForm.password}
            onChangeText={(text) => setRegisterForm({ ...registerForm, password: text })}
            className="ml-2 text-md md:text-xl h-12 w-[85%]"
          />
        </View>

        <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
          <Feather name="user" size={24} color="#F96163" />
          <TextInput
            placeholder="Name"
            value={registerForm.name}
            onChangeText={(text) => setRegisterForm({ ...registerForm, name: text })}
            className="ml-2 text-md md:text-xl h-12 w-[85%]"
          />
        </View>

        <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
          <Feather name="phone" size={24} color="#F96163" />
          <TextInput
            placeholder="Phone"
            value={registerForm.phone}
            onChangeText={(text) => setRegisterForm({ ...registerForm, phone: text })}
            onBlur={() => {
              const thaiTelFormat = /^0[0-9]{2}-[0-9]{7}$/;
              if (!thaiTelFormat.test(registerForm.phone) && registerForm.phone !== "") {
                // Provide feedback for wrong phone format
                alert("รูปแบบเบอร์โทรไม่ถูกต้อง");
              }
            }}
            className="ml-2 text-md md:text-xl h-12 w-[85%]"
          />
        </View>

        <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
        <Ionicons name="location-outline" size={24} color="#F96163" />
          <TextInput
            placeholder="Location"
            value={registerForm.location}
            multiline
            onChangeText={(text) => setRegisterForm({ ...registerForm, location: text })}
            className="ml-2 text-md md:text-xl min-h-12 h-auto w-[85%]"
          />
        </View>

        {/* <View className='border-2 border-primary rounded-lg bg-white h-14 justify-center'> */}
        <View >
            {/* Dropdown for selecting gender */}
            <SelectList
                data={genderOptions}
                setSelected={(val) => setRegisterForm({ ...registerForm, gender: val })}
                placeholder="Select Gender"
                boxStyles={{borderRadius:8, borderWidth:2,borderColor:"#F96163",}}
            />
        </View>

        <TouchableOpacity onPress={handleSignUp}>
          <View className="flex h-12 w-2/3 rounded-lg self-center justify-center bg-primary">
            <Text className="text-center text-white font-bold text-lg md:text-2xl">
              Sign Up
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-4 mt-2">
        <Text className="text-md md:text-xl">Already have an account?</Text>
        <TouchableOpacity onPress={onSignInPress}>
          <Text className="text-md md:text-xl text-primary">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisForm;
