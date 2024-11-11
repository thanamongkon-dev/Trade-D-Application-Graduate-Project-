import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import io from "socket.io-client"; // Import Socket.io client library
import {url} from "@api";

const ChatRoom = ({ navigation, route }) => {
  const chat = route.params;
  const [inputExpanded, setInputExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  // Declare the socket variable at a higher scope
  const socket = io(url); // Replace with your server's IP address

  useEffect(() => {
    // Listen for incoming messages
    fetchChatMessages();
    socket.on("chat message", (message) => {
      // Add the received message to the messages state
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    // Clean up when the component unmounts
    return () => {
      socket.disconnect(); // Disconnect from the server
    };
  }, []);

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const fetchChatMessages = async () => {
    try {
      // console.log(chat.chat_id)
      const res = await url.get(`/chat/message/${chat.chat_id}`);
      // console.log('messsage',res.data)
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching user data: ',error);
    }
  }

  const sendMessage = () => {
    // Send the message to the server
    if (inputText.trim() !== "") {
      const message = {
        chat_id: chat.chat_id,
        sender_uid: chat.uid, // Replace 'uid' with the user's ID
        message_text: inputText,
        send_at: new Date().toISOString(), // Convert to ISO timestamp string
      };
      // Emit the message to the server
      socket.emit("chat message", message);
      setInputText("");
    }
  };
  // console.log(messages)
  return (
    <View className="flex flex-col container w-full h-full bg-white">
      {/* Header */}
      <View className="flex h-[60px] bg-white justify-center p-4 border-b-2 border-zinc-400 z-10">
        <Text className="font-bold text-xl">User UID : {chat.uid}</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ justifyContent: "flex-end" }}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            className={`flex flex-row items-end ${
              message.sender_uid === chat.uid ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender_uid !== chat.uid && (
              <Image
                className="h-9 w-9 bg-slate-600 rounded-full m-2"
                source={{ uri: "profile_image_url_for_other_user" }}
              />
            )}
            <Text
              className={`flex flex-col max-w-[80%] min-h-[30px] text-start text-white text-[16px] p-3 my-2 rounded-3xl bg-[#f96163] ${
                message.sender_uid === chat.uid ? "self-end mx-3" : "self-start"
              }`}
            >
              {message.message_text}
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
          onPress={sendMessage}
        />
      </View>
    </View>
  );
};

export default ChatRoom;
