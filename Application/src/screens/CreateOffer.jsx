import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet
} from "react-native";
import React, { useState, useEffect } from "react";
import { url } from "@api";
import { ImageSelect } from "../hooks/imageSelect";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CreateOffer = ({route}) => {
  const { selectedImages, handleImageSelect, setSelectedImages } = ImageSelect();
  const offerData = route.params.item
  const navigation = useNavigation();

  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState("");

  console.log(offerData)

  const createOffer = async () => {
    try {
      if (!condition.trim() || !message.trim() ){
        alert('กรุณากรอกข้อมูลให้ครบ')
        return;
      }else if (selectedImages.length == 0 ){
        alert('กรุณาเลือกภาพตัวอย่าง')
        return;
      }
      const formData = new FormData();
      formData.append("user_offer_id", offerData.user_id);
      formData.append("to_item_id", offerData.item_id);
      formData.append("item_name", offerData.item_name);
      formData.append("offer_to_userId", offerData.offer_to_userId);
      formData.append("condition", condition);
      formData.append("offer_message", message);
      selectedImages.forEach((image) => {
        formData.append('images',{
            uri:image.uri,
            type:"image/jpeg",
            name:image.filename
        })
      })

      let res = await url.put('/offer/createOffer',
      formData,
      {
        headers: {
            "Content-Type": "multipart/form-data",
        }
      }
      );

      const responseData = res.data;

      if (responseData.status === "success" ) {
        alert("Make Offer Success")
        navigation.navigate("ChatList")
        setMessage('')
      } else {
        alert("Error creating offer")
      }
    } catch (error) {
        // console.error("");
        alert("An error occurred while creating the offer.");
    }
  };

  const handleRemoveImage = (uri) => {
    setSelectedImages(selectedImages.filter((image) => image.uri !== uri));
  };

  return (
    <ScrollView className="bg-slate-50">
      <View className="flex h-full w-full p-3 gap-3 justify-center">
        {selectedImages.length === 0 ? (
          <View className='h-[400px] md:h-[550] items-center justify-center border-2 border-slate-200 rounded-xl bg-white'>
            <Text className='text-md md:text-4xl'>ไม่มีรูปที่ถูกเลือก</Text>
          </View>
        ) : (
          <FlatList
            data={selectedImages}
            horizontal={true}
            renderItem={({ item }) => (
              <View className="flex h-[400px] justify-center items-center ">
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 350, height: 350 }}
                  className="rounded-xl mx-2 "
                />
                <TouchableOpacity
                  className="absolute right-[15px] top-[30px] p-3 bg-red-400 rounded-full border-slate-200 border-2"
                  onPress={() => handleRemoveImage(item.uri)}
                >
                  <Text className="text-white"> X </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}

        <TouchableOpacity onPress={() => handleImageSelect(true)}>
          <View className="w-[250px] h-[50px] md:w-[350] md:h-[70] bg-red-400 self-center justify-center items-center rounded-xl">
            <Text className="text-white text-xl md:text-3xl">เลือกรูปภาพ</Text>
          </View>
        </TouchableOpacity>

        <View className="flex w-full">
          <View>
            <Text className="text-lg md:text-2xl font-bold ">เงื่อนไขการแลกเปลี่ยน</Text>
            <KeyboardAvoidingView
              keyboardVerticalOffset={100}
              // style={{ width: "100%" }}
              className='w-full bg-white border-slate-200 border-2 rounded-lg h-auto'
            >
              <TextInput
                onChangeText={(text) => setCondition(text)}
                multiline
                editable
                clearButtonMode='always'
                autoCapitalize='none'
                spellCheck={false}
                placeholder="เงื่อนไขการแลกเปลี่ยนกรณีผู้ใช้อื่นมีสินค้ามาเสนอ"
                className="p-2 text-md md:text-2xl h-12 w-full"
              />
            </KeyboardAvoidingView>
          </View>
          <View>
            <Text className="text-lg md:text-2xl font-bold ">ส่งข้อความถึงผู้ขาย</Text>
            <KeyboardAvoidingView
              keyboardVerticalOffset={100}
              // style={{ width: "100%" }}
              className='w-full bg-white border-slate-200 border-2 rounded-lg h-[200]'
            >
              <TextInput
                onChangeText={(text) => setMessage(text)}
                multiline
                editable
                clearButtonMode='always'
                autoCapitalize='none'
                spellCheck={false}
                maxLength={40}
                placeholder="ใส่รายละเอียดที่นี่"
                className="p-2 text-md md:text-2xl h-auto w-full"
              />
            </KeyboardAvoidingView>
          </View>

        </View>
        <TouchableOpacity onPress={createOffer}>
          <View className="w-[250px] h-[50px] md:w-[350] md:h-[70] bg-red-400 self-center justify-center items-center rounded-xl">
            <Text className="text-white font-semibold text-xl md:text-2xl">ยืนยัน</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateOffer;