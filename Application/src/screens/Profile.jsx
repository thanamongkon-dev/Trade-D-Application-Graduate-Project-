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
import { useState, useEffect } from "react";
import { Entypo, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { usePosts,deletePost } from "../hooks/usePosts";
import { useAuth } from "../hooks/AuthContext";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { useIsFocused } from "@react-navigation/native";
import { url } from "@api"
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { posts, loading, uid, userInfo, fetchPostsByUser } =
    usePosts();
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 34 : 48;
  const dotSize = width < 768 ? 18 : 26;
  const users = userInfo;
  const isFocused = useIsFocused();
  const [postDeleted, setPostDeleted] = useState(false);
  const [status, setStatus] = useState([])

  useEffect(() => {
    fetchPostsByUser();
    getStatusCount()
  }, [isFocused,postDeleted]);

  const getStatusCount = async () => {
    let res = await url.get("/user/getStatus/"+user.user_id)
    if(!res.error){
      setStatus(res.data)
    }
  }

  const handleEdit = (Post) => {
    navigation.navigate("EditPost", { post: Post });
  };

  const formatDate = (dateString) => {
    const thaiFormat = format(parseISO(dateString), "d MMMM yyyy, HH:mm", {
      locale: th,
    });
    return thaiFormat;
  };

  const handleDelete = (postId) => {
    // Implement the logic for deleting a post
    // Show a confirmation dialog and delete the post if confirmed
    Alert.alert(
      `Delete Post ${postId}`,
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deletePost(postId);
            setPostDeleted(true); // Update the state variable after deletion
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
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

          <View className="absolute top-5 right-4">
            <Menu>
              <MenuTrigger>
                <View className="w-8 h-8 justify-center items-center">
                  <Entypo
                    name="dots-three-vertical"
                    size={dotSize}
                    color="black"
                  />
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={optionsStyles}>
                {item.user_id === uid && (
                  <>
                    <MenuOption onSelect={() => handleEdit(item)} text="Edit" />
                    <MenuOption
                      onSelect={() => handleDelete(item.item_id)}
                      text="Delete"
                    />
                  </>
                )}
              </MenuOptions>
            </Menu>
          </View>

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

  const optionsStyles = {
    optionText: {
      color: "brown",
      fontSize: 17,
      textAlign: "center",
    },
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#f96163"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <ScrollView>
      <View className="flex-1 bg-slate-900">
        <View className="w-full h-[150] z-10">
          <View className="self-center items-center mt-[50] border-2 w-[175] h-[175] rounded-full bg-white overflow-hidden">
            <Image
              source={{ uri: user.profile }}
              className="w-[175] h-[175] rounded-full"
            />
          </View>
        </View>
        <View className="h-[230] rounded-t-[95px] bg-white pt-[80]">
          <View className="justify-center items-center h-auto gap-1.5">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold md:text-4xl pr-2">
                {user.name}
              </Text>

              <Pressable onPress={() => navigation.navigate("EditProfile")}>
                <Feather name="edit" size={18} color="#F96163" />
              </Pressable>
            </View>
            <Text className="text-lg font-semibold text-center md:text-2xl ">
              {user.bio}
            </Text>

            <View className='flex-row w-full justify-evenly pt-3'>
              <Text className='text-sm md:text-md text-white px-2 py-1 text-center rounded-full bg-[#D6B85A]'> Pending : {status.PendingCount}</Text>
              <Text className='text-sm md:text-md text-white px-2 py-1 text-center rounded-full bg-[#028A0F]'> Complete : {status.CompleteCount}</Text>
              <Text className='text-sm md:text-md text-white px-2 py-1 text-center rounded-full bg-[#E3242B]'> Cancel : {status.CancelCount}</Text>
            </View>
          </View>
        </View>
        <View className="bg-white px-2 h-full">
          {posts.map((post) => (
            <RenderPost item={post} key={post.item_id} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Profile;
