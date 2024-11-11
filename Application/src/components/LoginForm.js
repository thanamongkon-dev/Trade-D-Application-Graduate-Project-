import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  MaterialCommunityIcons,Feather 
} from "@expo/vector-icons";

import { useAuth } from "../hooks/AuthContext";

const LoginForm = ({ onSignUpPress }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  
  const handleLogin = async () => {
    // Basic input validation
    if (!email.trim() || !password.trim()) {
        Alert.alert('Validation Error', 'Please enter both email and password.');
        return;
      }
      const result = await login(email, password);
  };

  return (
    //container
    <View className='flex w-full h-auto p-5 items-center'>
        {/* form container */}
        <View className='rounded-xl w-full p-5 self-center gap-3'>
            <Text className='font-bold text-center text-amber-950 text-[42px] '>Welcome</Text>
            <View className='flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center'>
                <Feather  name="mail" size={24} color="#F96163" />
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    name='email'
                    placeholder='Email'
                    className='ml-2 text-md md:text-xl h-12 w-[85%]'
                    autoFocus={true}
                />
            </View>
            <View className='flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center'>
                <Feather name="lock" size={24} color="#F96163" />
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    name='Password'
                    placeholder='Password'
                    secureTextEntry={true} // Use secureTextEntry for Password
                    className='ml-2 text-md md:text-xl h-12 w-[85%]'
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Forget",{IsEdit:false})} className='items-end'>
                <Text className='text-md md:text-xl text-primary' >Forget Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin}>
                <View className='flex h-12 w-2/3 rounded-lg self-center justify-center bg-primary'>
                    <Text className='text-center text-white font-bold text-lg md:text-2xl'>Login</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View className='flex-row gap-4 mt-2'>
            <Text className='text-md md:text-xl' >Don't have an account yet?</Text>
            <TouchableOpacity onPress={onSignUpPress}>
                <Text className='text-md md:text-xl text-primary' >Register</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default LoginForm;
const styles = StyleSheet.create({
  Form: {
    display: "flex",
    //backgroundColor:'#FFDBAA',
    justifyContent: "center",
    //paddingVertical:25,
    width: "80%",
    height: "auto",
    
  },
  TextContainer: {
    alignItems: "center",
    marginVertical: 15,
    flexDirection: "column",
    width: "auto",
    height: "auto",
    justifyContent: "center",
    //backgroundColor:'pink'
  },
  Input: {
    //borderRadius: 8 ,
    // borderBottomWidth:2,
    // borderColor:"#ccc",
    width: "100%",
    height: 50,
    paddingLeft: 7,
    fontSize: 18,
    backgroundColor: "white",
    //marginVertical:7
  },
  Input2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ccc",
    marginVertical: 7,
    paddingHorizontal: 15,
  },
  BTNContainer: {
    flexDirection: "row",
    display: "flex",
    height: 75,
    paddingVertical: 20,
    justifyContent: "space-around",
    alignItems: "center",
    gap: 30,
    //backgroundColor:'gray',
    marginTop: 60,
  },
  BTN: {
    display: "flex",
    backgroundColor: "#f96163",
    width: "43%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: 15,
  },
  Help: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  HelpBT: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  Option: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
});
