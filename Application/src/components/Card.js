import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions 
} from "react-native";
import React, { useState, useEffect, lazy,useRef } from "react";
import { MaterialCommunityIcons, Feather  } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { useAuth } from "../hooks/AuthContext";


const Card = ({Allposts, onEndReached}) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 24 : 32;
  const dotSize = width < 768 ? 18 : 26
  const flatListRef = useRef(null);
  
  const GoPro = (uid) => {
    if (uid == user.user_id) {
      // console.log("Owner UID: ", uid);
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Other", {uid: uid });
    }
  };

  const optionsStyles = {
    optionText: {
      color: "brown",
      fontSize: 17,
      textAlign: "center",
    },
  };

  const formatDate = (dateString) => {
    const thaiFormat = format(parseISO(dateString), 'd MMMM yyyy, HH:mm', { locale: th });
    return thaiFormat;
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      

      <FlatList
      ref={flatListRef}
      data={Allposts}
      renderItem={({ item }) => (
        <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-red-400 mb-2 drop-shadow-xl">
          <TouchableOpacity onPress={() => GoPro(item.user_id)}>
            <View className="flex flex-row items-center">
              <Image
                source={{ uri: item.profile }}
                className="w-11 h-11 rounded-full md:w-16 md:h-16 bg-slate-300"
              />
              <View className="ml-4">
                <Text className="font-bold text-md md:text-xl ">
                  {item.name}
                </Text>
                <Text className="text-sm md:text-lg text-gray-500">{formatDate(item.create_at)}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View className='gap-2 my-2'>
            <Text className="text-md md:text-xl">ชื่อ : {item.item_name}</Text>
            <Text className="text-md md:text-xl">เงื่อนไขการแลกเปลี่ยน : {item.condition}</Text>
            <Text multiline numberOfLines={2} className="text-md md:text-xl">{item.description}</Text>
          </View>

          

          <View style={{width: "auto" }} >
            <Image
              source={{ uri: item.images[0].imageUrl }}
              resizeMode="cover"
              className="rounded-md w-full h-[350px] md:h-[700] "
              onLoad={lazy}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { item: item })}
          >
            <View className="mt-4 shadow-md shadow-slate-400 flex-row items-center justify-center bg-primary rounded-full h-14 md:h-16 w-[80%] self-center">
              <Text className="text-white text-2xl mr-2 md:text-4xl">ตรวจสอบ</Text>
              <Feather name="search" size={iconSize} color="white" />
              {/* <MaterialCommunityIcons name="offer" size={iconSize} color="white" /> */}
            </View>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item,index) => index}
      style={{ flex: 1, width: "100%",}}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
    />

      <TouchableOpacity onPress={scrollToTop} 
      className='absolute bottom-8 right-[-8] w-12 h-12 bg-white rounded-full items-center justify-center shadow-md shadow-primary'
      >
        <Feather name="arrow-up" size={24} color="#F96163" />
      </TouchableOpacity>
    </View>
    
  );
};

export default Card;