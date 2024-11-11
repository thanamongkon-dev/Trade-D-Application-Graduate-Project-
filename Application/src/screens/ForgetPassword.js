import { View, Text, TextInput, TouchableOpacity,KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { url } from "@api";

const ForgetPassword = ({navigation,route}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(true);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(true);
  const [errorMessage, setError] = useState("")
  const IsEdit = route.params.IsEdit

  const handleSubmit = async () => {
    if (!email.trim() || !phone.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return setError("กรุณากรอกข้อมูลให้ครบ");
    }

    if(emailError){
      alert('กรุณากรอกอีเมล์ให้ถูกต้อง');
      return setError("กรุณากรอกอีเมล์ให้ถูกต้อง");
    }else if(phoneError){
      alert('กรุณากรอกเบอร์โทรให้ถูกต้อง');
      return setError("กรุณากรอกเบอร์โทรให้ถูกต้อง");
    }

    try {
      const res = await url.post("/auth/forget", {
        email: email,
        phone: phone,
      });

      if (res.data.status === "success") {
        alert("ข้อมูลถูกต้อง");
        navigation.navigate("ChangePass",{email:email,IsEdit:IsEdit});
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
        <Text className="font-bold text-lg md:text-2xl">ยืนยันตัวตน</Text>
        <View className="w-[95%] h-auto gap-2">
          <Text className="font-bold text-md md:text-xl">ตรวจสอบข้อมูล</Text>

          <View>
            <Text className="font-bold text-md md:text-xl">Email</Text>
            <TextInput
              onChangeText={(text) => {setEmail(text)}}
              onBlur={() => {
                const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailFormat.test(email) && email !== "") {
                  // Provide feedback for wrong email format
                  // alert("รูปแบบอีเมลไม่ถูกต้อง");
                  setError("กรุณากรอกอีเมล์ให้ถูกต้อง")
                }else {
                  setEmailError(false)
                }
              }}
              placeholder="ใส่ Email ของคุณ"
              className="pl-2 text-md md:text-2xl border-2 border-gray-300 rounded-md w-full h-[50] md:h-[70]"
            />
          </View>

          <View>
            <Text className="font-bold text-md md:text-xl">เบอร์โทร</Text>
            <TextInput
              onChangeText={(text) => {setPhone(text)}}
              onBlur={() => {
                const thaiTelFormat = /^0[0-9]{2}-[0-9]{7}$/;
                if (!thaiTelFormat.test(phone) && phone !== "") {
                  // Provide feedback for wrong phone format
                  // alert("รูปแบบเบอร์โทรไม่ถูกต้อง");
                  setError("กรุณากรอกเบอร์โทรให้ถูกต้อง")
                }else {
                  setPhoneError(false)
                }
              }}
              placeholder="ตัวอย่าง : 012-3456789"
              className="pl-2 text-md md:text-2xl border-2 border-gray-300 rounded-md w-full h-[50] md:h-[70]"
            />
          </View>
          <Text className='text-red-500'>{errorMessage}</Text>

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

export default ForgetPassword;
