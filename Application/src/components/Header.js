import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { FontAwesome, Ionicons,Feather  } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/AuthContext";

const Header = ({ headerText, headerIcon }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 24 : 32;
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Implement your logout logic
    logout();
  };

  return (
    <View className="flex-row border-b-2 border-b-slate-200 p-4 bg-white h-[60] md:h-[75]">
      <Text className="flex-1 text-xl md:text-3xl font-bold">{headerText}</Text>
      {/* <TouchableOpacity onPress={handleLogout} > */}
      {/* <TouchableOpacity
        onPress={() => navigation.navigate("ChatList", { uid: user.user_id })}
      >
        <Ionicons
          name={"ios-chatbubble-ellipses-outline"}
          size={iconSize}
          color="#f96163"
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={handleLogout}
      >
        <Feather 
          name={"log-out"}
          size={iconSize}
          color="#f96163"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
