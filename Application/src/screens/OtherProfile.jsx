import React, { useState, useEffect,useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { url } from "../api";
import { Entypo, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

const OtherProfile = ({ route, navigation }) => {
  const [Otheruser, setUserData] = useState([]);
  const [Otherposts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading indicator
  const [status, setStatus] = useState([])
  const newUid = route.params?.uid;
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 34 : 48;

  

  const fetchUserData = async (id) => {
    try {
      const res = await url.get(`/user/${id}`);
      // console.log("Otheruser : ", res.data);
      setUserData(res.data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const fetchPosts = async (id) => {
    try {
      const res = await url.get(`/posts/user_PTC/${id}`);
      // console.log(res.data[0].imageUrl);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!newUid) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'root' }],
          });
          return;
        }
        await fetchUserData(newUid);
        await fetchPosts(newUid);
        await getStatusCount();
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [newUid, navigation]);

  const getStatusCount = async () => {
    let res = await url.get("/user/getStatus/"+newUid)
    if(!res.error){
      setStatus(res.data)
    }
  }

  const formatDate = (dateString) => {
    const thaiFormat = format(parseISO(dateString), 'd MMMM yyyy, HH:mm', { locale: th });
    return thaiFormat;
  };



  const RenderPost = ({ item }) => {
    return (
      <>
        <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-red-400 mb-2 drop-shadow-xl">
          <TouchableOpacity>
            <View className="flex flex-row items-center overflow-hidden">
              <Image
                source={{ uri: item.profile }}
                className="w-11 h-11  md:w-16 md:h-16 rounded-full bg-slate-300"
              />
              <View className="ml-4">
                <Text className="font-bold text-md md:text-xl ">
                  {item.name}
                </Text>
                <Text className="text-sm md:text-lg text-gray-500">
                  {formatDate(item.create_at)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View className="gap-2 my-2">
            <Text className="text-md md:text-xl">ชื่อ : {item.item_name}</Text>
            <Text className="text-md md:text-xl">
              เงื่อนไขการแลกเปลี่ยน : {item.condition}
            </Text>
            <Text multiline numberOfLines={2} className="text-md md:text-xl">
              {item.description}
            </Text>
          </View>

          <View style={{ width: "auto" }}>
            <Image
              source={{ uri: item.images[0].imageUrl }}
              resizeMode="cover"
              className="rounded-lg w-full h-[350px] md:h-[700]"
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { item: item })}
          >
            <View className="mt-4 shadow-md shadow-slate-400 flex flex-row items-center justify-center bg-primary rounded-full h-14 md:h-16 w-[80%] self-center">
              <Text className="text-white text-2xl mr-2 md:text-4xl">
                ตรวจสอบ
              </Text>
              <Feather name="search" size={iconSize} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  };




  if (loading) {
    return <ActivityIndicator size="large" color="#f96163" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView>
      <View className="flex-1 bg-slate-900">
        <View className="w-full h-[150] z-10">
          <View className="self-center items-center mt-[50] border-2 w-[175] h-[175] rounded-full bg-white overflow-hidden">
            <Image
              source={{ uri: Otheruser.profile }}
              className="w-[175] h-[175] rounded-full"
            />
          </View>
        </View>
        <View className="h-[230] rounded-t-[95px] bg-white pt-[80]">
          <View className="justify-center items-center h-auto gap-1.5">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold md:text-4xl pr-2">
                {Otheruser.name}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-center md:text-2xl ">
              {Otheruser.bio}
            </Text>

            <View className='flex-row w-full justify-evenly pt-3'>
              <Text className='text-sm md:text-md text-white px-2 py-1 text-center rounded-full bg-[#D6B85A]'> Pending : {status.PendingCount}</Text>
              <Text className='text-sm md:text-md text-white px-2 py-1 text-center rounded-full bg-[#028A0F]'> Complete : {status.CompleteCount}</Text>
              <Text className='text-sm md:text-md text-white px-2 py-1 text-center rounded-full bg-[#E3242B]'> Cancel : {status.CancelCount}</Text>
            </View>
          </View>
        </View>
        <View className="bg-white px-2 h-full">
          {Otherposts.map((post) => (
            <RenderPost item={post} key={post.item_id} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    // alignItems: "center",
    backgroundColor: "white",
    display:'flex',
    width:'100%',
    height:420,
    //marginBottom:7
  },
});

export default OtherProfile;
