import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Entypo,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { io } from "socket.io-client";
import * as ImagePicker from "expo-image-picker";
import moment from "moment/moment";
import { url } from "../../api";
import { ImageSelect } from "../../hooks/imageSelect";
import { useFocusEffect } from "@react-navigation/native";

const ChatRoom2 = ({ route }) => {
  // console.log(route.params.uid,route.params.chat_id)
  const [message, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);
  // const uid = route.params.uid;
  // const partner_id = route.params.partner_id;
  // const name = route.params.name;
  // const profile = route.params.profile;
  const { uid, partner_id, name, profile } = route.params;
  const primary = "#f96163";

  const { selectedImages, handleImageSelect, setSelectedImages } =
    ImageSelect();

  const handleRemoveImage = (uri) => {
    setSelectedImages(selectedImages.filter((image) => image.uri !== uri));
  };

  const socket = io("127.0.0.1:3000");
  // const socket = io("https://trade-d-api.onrender.com")
  // const socket = io("https://4k8qfdn5-3000.asse.devtunnels.ms/");

  useEffect(() => {
    fetchMessages(uid, partner_id);

    async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access media library denied");
      }
    };

    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async (uid, pid) => {
    try {
      const res = await url.get(`/chat/message/${uid}/${pid}`);
      // console.log(res.data.message_text);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching Chat Data: ", error);
    }
  };

  const sendMessage = async () => {

    const message = {
      sender_id: uid,
      receiver_id: partner_id,
      type: "text",
      send_at: new Date().toISOString(),
    };

    if (inputText.trim() !== "") {
      // Send text first
      message.message_text = inputText;
      socket.emit("chat message", message);
    }

    if (selectedImages.length > 0) {
      // Send image later
      const image = await convertImageToBinary(selectedImages[0].uri);
      const imageMessage = {
        sender_id: uid,
        receiver_id: partner_id,
        type: "image",
        send_at: new Date().toISOString(),
        message_text: image,
      };
      socket.emit("chat message", imageMessage);
    }
    
    setSelectedImages([]);
    setInputText("");
  };

  const convertImageToBinary = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    return arrayBuffer;
  };

  const isMyMessage = (id) => {
    return id === uid;
  };

  const renderChat = ({ item }) => {
    return (
      <View className="p-3">
        <View
          className="rounded-md p-2 "
          style={{
            backgroundColor: isMyMessage(item.sender_id) ? primary : "#007500",
            marginLeft: isMyMessage(item.sender_id) ? "35%" : 0,
            marginRight: isMyMessage(item.sender_id) ? 0 : "35%",
          }}
        >
          {!isMyMessage(item.sender_id) && (
            <Text className=" text-white font-bold text-md md:text-xl mb-[5px] ">
              {" "}
              {item.sender_id}{" "}
            </Text>
          )}
          {item.type === "image" ? (
            <Image
              source={{ uri: item.message_text }}
              // className="h-[250] w-[200] md:h-[450] md:w-[400] rounded-xl self-center"
              className="h-[250] w-[200] md:h-[450] md:w-[400] rounded-xl self-center"
              resizeMode="cover"
            />
          ) : (
            <Text className=" text-white text-md md:text-xl">
              {" "}
              {item.message_text}{" "}
            </Text>
          )}

          <Text className="self-end text-slate-100 text-xs md:text-sm">
            {" "}
            {moment(item.timestamp).fromNow()}{" "}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex w-full h-full bg-slate-300">
      <View className="bg-white h-14 flex-row items-center border-b-2 border-slate-50 p-2">
        <Image
          source={{ uri: profile }}
          className="w-11 h-11 rounded-full md:w-16 md:h-16 bg-slate-300"
        />
        <Text className="pl-2 text-xl md:text-3xl">{name}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={message}
        renderItem={renderChat}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        keyExtractor={(item, index) => index}
        style={{ flex: 1 }}
        contentContainerStyle={{ justifyContent: "flex-end" }}
        ListEmptyComponent={() => (
          // Rendered when the data array is empty
          <View className="self-center mt-[550]">
            <Text className="text-xl md:text-5xl text-center font-bold text-white">
              เริ่มการพูดคุย
            </Text>
            <Text className="text-lg md:text-4xl text-center font-semibold text-white">
              ลองทักทาย {name} ดูสิ
            </Text>
          </View>
        )}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        style={{ width: "100%" }}
      >
        <View className="flex-row m-[10px] items-end">
          <View className="flex flex-row w-[85%] bg-white rounded-3xl p-3 mr-2 item-center md:h-16">
          {/* <FontAwesome5 name="laugh-beam" size={24} color="#9CA3AF" /> */}
            {/*Have to Grow up */}
            <View className='flex-1 flex-col-reverse'>
            <ScrollView>
            <TextInput
              placeholder="Aa"
              multiline
              value={inputText}
              onChangeText={setInputText}
              className="flex-1 mx-2 text-md md:text-2xl mt-2 mb-3 "
            />
            {selectedImages.length > 0 && (
              <View className='items-center'>
                <Image
                  source={{ uri: selectedImages[0].uri }}
                  className="h-[250] w-[250] self-end rounded-lg ml-2"
                />
                <TouchableOpacity
                onPress={() => setSelectedImages([])}
                className='absolute top-0 right-0 bg-red-600 p-1 rounded-full'
              >
                <Feather name="x-circle" size={24} color="black" />
              </TouchableOpacity>
              </View>
            )}
            </ScrollView>
            </View>      
            <TouchableOpacity onPress={() => handleImageSelect(false)} className="mx-2 self-center">
                <MaterialIcons name="photo-camera" size={24} color="#9CA3AF" />
            </TouchableOpacity>      
          </View>
          <TouchableOpacity onPress={sendMessage}>
            <View className="bg-[#f96163] rounded-3xl w-[50px] h-[50px] justify-center items-center">
              <MaterialCommunityIcons name="send" size={28} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatRoom2;
