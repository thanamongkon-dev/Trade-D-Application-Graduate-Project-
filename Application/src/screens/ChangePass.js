import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { url } from "@api";
import { Feather } from '@expo/vector-icons';

const ChangePass = ({ route,navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmpassword, setShowConfirmpassword] = useState(false);
  const {email,IsEdit} = route.params;

  const handleSubmit = async () => {
    try {
      if (!password.trim() || !confirmpassword.trim()) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      if (password !== confirmpassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
      }
 
      const res = await url.post("/auth/changePass", {
        email: email,
        password: password,
      });

      if (res.data.status === "success") {
        setShowPassword(false)
        setShowConfirmpassword(false)
        alert("เปลี่ยนรหัสผ่านสำเร็จ");
        if(IsEdit){
          navigation.navigate("Profile");
        }else{
          navigation.navigate("Auth");
        }
      } else {
        alert("เกิดข้อผิดพลาด: ข้อมูลไม่ถูกต้อง");
      }
    } catch (error) {
      //   console.error("เกิดข้อผู้ดพลาด:", error);

      // Check if the error response contains a message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`เกิดข้อผู้ดพลาด: ${error.response.data.message}`);
      } else {
        alert("เกิดข้อผู้ดพลาด: กรุณาลองอีกครั้ง");
      }
    }
  };

  return (
    <KeyboardAvoidingView className=" bg-gray-800 w-full h-full items-center justify-center">
      <View className="bg-white w-[80%] h-auto border-2 rounded-xl items-center py-4">
        <Text className="font-bold text-lg md:text-2xl text-amber-950">
          เปลี่ยนรหัสผ่าน
        </Text>
        <View className="w-[95%] h-auto gap-2">
          <Text className="font-bold text-md md:text-xl text-amber-950">
            กรุณาตั้งรหัสผ่านใหม่
          </Text>

          <View>
            <Text className="font-bold text-md md:text-xl text-amber-950">
              รหัสผ่านใหม่
            </Text>
            <View className='flex-row border-2 pl-2 border-gray-300 rounded-lg bg-white h-13 items-center'>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    placeholder='ใส่รหัสผ่านของคุณ'
                    secureTextEntry={showPassword} // Use secureTextEntry for Password
                    className='ml-2 text-md md:text-xl h-12 w-[85%]'
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? 
                    <Feather name="eye" size={24} color="gray" />
                    : 
                    <Feather name="eye-off" size={24} color="gray" />
                    }
                </TouchableOpacity>
            </View>

          </View>

          <View>
            <Text className="font-bold text-md md:text-xl text-amber-950">
              ยืนยันรหัสผ่าน
            </Text>
            <View className='flex-row border-2 pl-2 border-gray-300 rounded-lg bg-white h-13 items-center'>
                <TextInput
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholder='ยืนยันรหัสผ่านของคุณ'
                    secureTextEntry={showConfirmpassword} // Use secureTextEntry for Password
                    className='ml-2 text-md md:text-xl h-12 w-[85%]'
                />
                <TouchableOpacity onPress={() => setShowConfirmpassword(!showConfirmpassword)}>
                    {showConfirmpassword ? 
                    <Feather name="eye" size={24} color="gray" />
                    : 
                    <Feather name="eye-off" size={24} color="gray" />
                    }
                </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleSubmit}>
            <View className="flex h-12 w-2/3 mt-3 rounded-lg self-center justify-center bg-primary">
              <Text className="text-center text-white font-bold text-lg md:text-2xl">
                ยืนยัน
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePass;
