import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getChats, url } from "@api";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../hooks/AuthContext";
import moment from "moment/moment";


const ChatList = () => {
  const [chat, setChat] = useState([]);
  const { user } = useAuth();
  
  const uid = user.user_id;
  const navigation =useNavigation();
  const isFocused = useIsFocused();


  useEffect(() => {
    if(isFocused) {
        fetchChat();
    }
  }, [isFocused]);

  const fetchChat = async () => {
    try {
      const res = await url.get(`/chat/${uid}`);
      // console.log(res.data);
      setChat(res.data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const renderChatList = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Chat2',{ 
        uid: uid, 
        partner_id: item.chat_partner,
        name:item.name,
        profile:item.profile
         })} >
        <View style={styles.Container}>
          <Image source={{uri : item.profile}} style={styles.Image} />

          <View className="w-[63%] mx-2 h-[50px] overflow-hidden">
            <Text style={styles.Text}>{item.name}</Text>
            <Text style={styles.Text}>{item.last_message_sender_id === uid  ? 'คุณ:':'เขา:' } {item.last_message_type === 'text' ? item.last_message : 'send a picture'}</Text>
          </View>

          <Text>{" "}{moment(item.last_message_timestamp).fromNow()}{" "}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={chat}
      renderItem={renderChatList}
      keyExtractor={(item) => item.chat_partner.toString()}
      style={{ flex: 1, width: "100%" }}
    />
  );
};

export default ChatList;

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    height: "auto",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    borderBottomWidth: 2,
    borderColor: "#CCC",
  },
  Image: {
    backgroundColor: "#CCC",
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  Text: {
    // marginVertical:9,
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
  },
});
