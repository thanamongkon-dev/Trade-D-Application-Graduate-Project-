import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const ChatRoom = () => {
  const [inputExpanded, setInputExpanded] = useState(false);
  const [inputText, setInputText] = useState("");

  const messages = [
    { id: 1, text: "Hello", uid: 1 },
    { id: 2, text: "Hi", uid: 2 },
    { id: 3, text: "How are you?", uid: 1 },
    { id: 4, text: "I'm good, thanks", uid: 2 },
    { id: 5, text: "I'm good, thanks", uid: 2 },
    { id: 6, text: "I'm good, thanks", uid: 2 },
    { id: 7, text: "I'm good, thanks", uid: 2 },
    { id: 8, text: "I'm good, thanks", uid: 2 },
    { id: 9, text: "I'm good, thanks", uid: 2 },
    { id: 10, text: "I'm good, thanks", uid: 2 },
    { id: 11, text: "I'm good, thanks", uid: 2 },
    { id: 12, text: "I'm good, thanks", uid: 2 },
  ];

  const scrollViewRef = useRef();

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View className="flex flex-col container w-full h-full bg-white">
      {/* header */}
      <View className="flex h-[60px] bg-white justify-center p-4 border-b-2 border-zinc-400 z-10">
        <Text className="font-bold text-xl">Username</Text>
      </View>

      {/* Messages */}
      {/* <ScrollView
        ref={scrollViewRef}
        className="flex-1 flex justify-end gap-3 h-auto overflow-hidden"
        onContentSizeChange={scrollToBottom}
        > */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }} // Add this style
        contentContainerStyle={{ justifyContent: "flex-end" }} // Apply justifyContent here
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`flex flex-row items-end ${
              message.uid === 1 ? "justify-end" : "justify-start"
            }`}
          >
            {message.uid !== 1 && (
              <Image
                className="h-9 w-9 bg-slate-600 rounded-full m-2"
                source={{ uri: "profile_image_url_for_other_user" }}
              />
            )}
            <Text
              className={`flex flex-col max-w-[80%] min-h-[30px] text-start text-white text-[16px] p-3 my-2 rounded-3xl bg-[#f96163] ${
                message.uid === 1 ? "self-end" : "self-start"
              }`}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View className="flex flex-row h-auto justify-between items-center bg-white p-2">
        <TouchableOpacity
          onPress={() => setInputExpanded(!inputExpanded)}
          style={{ marginRight: 10, opacity: inputExpanded ? 0 : 1 }}
        >
          <FontAwesome5 name="plus" size={28} color={"#f96163"} />
        </TouchableOpacity>
        {inputExpanded && (
          <>
            <FontAwesome5
              name="camera"
              size={28}
              color={"#f96163"}
              style={{ marginRight: 10 }}
            />
            <FontAwesome5
              name="images"
              size={28}
              color={"#f96163"}
              style={{ marginRight: 10 }}
            />
          </>
        )}
        <TextInput
          placeholder="ข้อความ"
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          multiline
          style={{
            flex: 1,
            height: inputExpanded ? null : 40,
            borderColor: "#f96163",
            borderWidth: 2,
            borderRadius: 20,
            padding: 10,
            marginRight: 10,
          }}
        />
        <Ionicons
          name="send"
          size={28}
          color={"#f96163"}
          onPress={() => {
            // Handle sending the message here
            console.log("Sending message:", inputText);
            setInputText("");
          }}
        />
      </View>
    </View>
  );
};

export default ChatRoom;
