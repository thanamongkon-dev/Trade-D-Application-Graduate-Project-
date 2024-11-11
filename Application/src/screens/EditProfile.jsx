import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { ImageSelect } from "../hooks/imageSelect";
import { url } from "@api";
import { useAuth } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({ navigation }) => {
  const { user, setUser } = useAuth();
  let { user_id, name, bio, email, phone, location, profile } = user;
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 28 : 34;
  const primary = "#f96163";
  // let { } = route.params;
  const [userInfo, setInFo] = useState({
    email: email,
    bio: bio,
    name: name,
    profile: profile,
    phone: phone,
    location: location,
  });
  const { selectedImages, handleImageSelect, setSelectedImages } =
    ImageSelect();
  let UsingImage =
    selectedImages.length > 0 ? selectedImages[0].uri : userInfo.profile;

  const handleUpdateProfile = async () => {
    console.log(selectedImages[0]);
    try {
      if (
        !userInfo.name.trim() ||
        !userInfo.bio.trim() ||
        !userInfo.location.trim()
      ) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("name", userInfo.name);
      formData.append("bio", userInfo.bio);
      formData.append("location", userInfo.location);

      if (selectedImages.length > 0) {
        formData.append("image", {
          uri: selectedImages[0].uri,
          type: "image/jpeg",
          name: selectedImages[0].filename,
        });
      }

      let response = await url.put("/user/EditProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = response.data;
      if (responseData.status === "success") {
        const data = response.data.user[0];
        setUser(data);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        // Uncomment the above line if needed

        console.log(data);
        navigation.navigate("Profile");
      } else {
        alert("Error updating profile: " + responseData.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View className="flex-1 bg-slate-900">
        <View className="w-full h-[20%] z-10 ">
          <Pressable onPress={() => handleImageSelect(false)}>
            <View className="self-center items-center mt-[50] border-2 w-[175] h-[175] rounded-full bg-white overflow-hidden">
              <Image
                source={{ uri: UsingImage }}
                className="w-[175] h-[175] rounded-full"
              />
            </View>
          </Pressable>
        </View>

        <View className="flex-2 pt-[100] rounded-t-[95px] h-full bg-white border-2 border-white px-10 gap-3">

            <Text className='text-center text-3xl font-bold text-amber-950'> User Inofmation </Text>

          <KeyboardAvoidingView>
            <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
              <Feather name="user" size={24} color="#F96163" />
              <TextInput
                placeholder="Name"
                value={userInfo.name}
                onChangeText={(text) => setInFo({ ...userInfo, name: text })}
                className="ml-2 text-md md:text-xl h-12 w-[85%]"
              />
            </View>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView>
            <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
              <Feather name="edit-2" size={24} color="#F96163" />
              <TextInput
                placeholder="Bio"
                value={userInfo.bio}
                onChangeText={(text) => setInFo({ ...userInfo, bio: text })}
                className="ml-2 text-md md:text-xl h-12 w-[85%]"
              />
            </View>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView>
            <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
              <Feather name="mail" size={24} color="#F96163" />
              <TextInput
                placeholder="Email"
                value={userInfo.email}
                className="ml-2 text-md md:text-xl h-12 w-[85%]"
                editable={false}
              />
            </View>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView>
            <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center justify-around">
              <Feather name="unlock" size={24} color="#F96163" />
              <TextInput
                value={"xxxxxxxxxxxxx"}
                secureTextEntry={true}
                className="ml-2 text-md md:text-xl h-12 w-[75%]"
                editable={false}
              />
              <Pressable onPress={() => navigation.navigate("Forget",{IsEdit:true})}>
                <Feather name="edit" size={18} color="#F96163" />
              </Pressable>
            </View>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView>
            <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
              <Feather name="phone" size={24} color="#F96163" />
              <TextInput
                value={userInfo.phone}
                className="ml-2 text-md md:text-xl h-12 w-[85%]"
                editable={false}
              />
            </View>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView>
            <View className="flex-row border-2 pl-2 border-primary rounded-lg bg-white h-14 items-center">
              <Feather name="map-pin" size={24} color="#F96163" />
              <TextInput
                value={userInfo.location}
                multiline
                onChangeText={(text) =>
                  setInFo({ ...userInfo, location: text })
                }
                className="ml-2 text-md md:text-xl h-12 w-[85%]"
              />
            </View>
          </KeyboardAvoidingView>

          <View className="flex flex-row items-center justify-around w-full h-auto my-4">
            <TouchableOpacity
              onPress={handleUpdateProfile}
              className="flex-row flex bg-green-400 items-center justify-center w-1/3 h-12 md:h-16 rounded-lg"
            >
              <FontAwesome5 name={"save"} size={iconSize} color={"#FFF"} />
              <Text className="text-white font-bold text-xl md:text-3xl">
                {" "}
                Save{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: primary }}
              className="flex-row flex items-center justify-center w-1/3 h-12 md:h-16 rounded-lg"
            >
              <MaterialIcons name={"cancel"} size={iconSize} color={"#FFF"} />
              <Text className="text-white font-bold text-xl md:text-3xl">
                {" "}
                Cancel{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
