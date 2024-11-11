import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect,useCallback } from "react";
import { FontAwesome, MaterialCommunityIcons,Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import CustomImageSlider from "@components/CustomImageSlider";
import { url } from "@api";
import { useAuth } from "../hooks/AuthContext";

const DetailScreen = ({ navigation, route }) => {
  const [imagesUrl, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 28 : 32;
  const post = route.params.item;
  const { user } = useAuth();

  const offerData = {
    user_id: user.user_id,
    item_id: post.item_id,
    item_name: post.item_name,
    offer_to_userId: post.user_id,
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setImages(post.images);
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      await fetchPosts(post.item_id);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  },[]);

  const fetchPosts = async (id) => {
    try {
      const res = await url.get(`/offer/getOffers/` + id);
      // console.log(res.data);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  const formatDate = (dateString) => {
    const thaiFormat = format(parseISO(dateString), "d MMMM yyyy, HH:mm", {
      locale: th,
    });
    return thaiFormat;
  };

  const CheckStatus = () => {
    if (post.status === "Pending") {
      return "#D6B85A";
    } else if (post.status === "Complete") {
      return "#028A0F";
    } else {
      return "#E3242B";
    }
  };

  const first10Posts = posts.slice(0, 10);
  const OfferRender = () => {
    if (first10Posts.length == 0) {
      return (
        <View className="h-[150] justify-center">
          <Text className="text-md font-semibold md:text-xl text-center">
            No offers available
          </Text>
        </View>
      );
    }

    return (
      <>
        {first10Posts.map((item, index) => (
          <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 mb-2" key={index}>
            {/* Header */}
            <View className="flex-row gap-2 items-center">
              <View className="w-11 h-11 md:w-16 md:h-16 rounded-full items-center justify-center overflow-hidden">
                <Image
                  source={{ uri: item.profile }}
                  resizeMode="cover"
                  className="w-11 h-11 md:w-16 md:h-16 border-2 rounded-full bg-slate-300"
                />
              </View>
              <View>
                <Text className="text-md font-semibold md:text-xl">
                  {item.name}
                </Text>
                <Text className="text-md md:text-xl text-slate-400">
                  {formatDate(item.create_at)}
                </Text>
              </View>
            </View>
            {/* Info */}
            <View className="p-2">
              <Text className="text-md md:text-xl">{item.condition}</Text>
            </View>
            {/* Image */}
            <View className=" justify-center items-center w-full">
              <View className="w-[95%] h-[350] md:h-[700] rounded-xl">
                <Image
                  source={{ uri: item.preview_image }}
                  resizeMode="cover"
                  className="rounded-lg w-full h-[350px] md:h-[700] "
                />
              </View>
            </View>
            {/* Button */}

            <View style={{
              display: item.wisher_id == user.user_id ? 'none' : 'flex'
            }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Chat2", {
                    uid: user.user_id,
                    partner_id: item.wisher_id,
                    name: item.name,
                    profile: item.profile,
                  });
                }}
              >
                <View className="mt-4 shadow-md shadow-slate-400 flex-row items-center justify-center bg-primary rounded-full h-14 md:h-16 w-[80%] self-center">
                  <Text className="text-white text-2xl mr-2 md:text-4xl">
                    ติดต่อ
                  </Text>
                  <Ionicons name='ios-chatbubble-ellipses-outline' size={iconSize} color={"#FFF"} />
                </View>
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </>
    );
  };
  // console.log('images', imagesUrl)
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Navtab */}
      <SafeAreaView className="flex-row px-4 py-2 items-center justify-between">
        <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
          <FontAwesome
            name={"arrow-circle-left"}
            size={iconSize}
            color="#f96163"
          />
        </Pressable>
        <Text className="flex-1 text-xl md:text-3xl font-bold">Detail</Text>

        <View
          className="h-6 px-2 rounded-2xl justify-center"
          style={{
            backgroundColor: CheckStatus(),
          }}
        >
          <Text className="text-md md:text-lg font-bold text-white decoration-solid decoration-2">
            {post.status}
          </Text>
        </View>
      </SafeAreaView>

      {/* content container */}
      <View className="flex w-full h-auto gap-2  items-center">
        {/* ImageDisplay */}
        <View style={styles.ImageContainer}>
          {/* <Slider images={imagesUrl}/> */}
          <CustomImageSlider images={imagesUrl} editMode={false} />
        </View>

        {/* Description */}

        <View className="flex-2 p-2 bg-white w-full">
          <View className="w-full p-2">
            {/* <Text style={styles.descriptionText}>ชื่อสินค้า : {post.item_name}</Text>
            <Text style={styles.descriptionText}>เงื่อนไขการแลกเปลี่ยน : {post.description}</Text> */}
            <Text style={styles.title}>ข้อมูลสินค้า</Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={expanded ? undefined : 4}
            >
              ชื่อสินค้า : {post.item_name} {"\n"}
              {"\n"}
              เงื่อนไขการแลกเปลี่ยน : {post.description} {"\n"}
              {"\n"}
              รายละเอียดสินค้า : {"\n"}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
              {post.description}
            </Text>
            <TouchableOpacity
              onPress={toggleDescription}
              style={styles.seeMoreButton}
            >
              <Text style={{ marginTop: 8 }}>
                {" "}
                {!expanded ? "ดูเพิ่มเติม" : "ดูน้อยลง"}{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {post.user_id != user.user_id || post.status === "Pending" && (
          <View className="bg-white w-full items-center justify-center h-[80]">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CreateOffer", { item: offerData })
              }
            >
              <View className="flex flex-row justify-center items-center h-[60] w-[300] rounded-xl shadow-md bg-primary ">
                <Text className="text-white text-2xl m-2">
                  เสนอสินค้าของคุณ
                </Text>
                <MaterialCommunityIcons name="offer" size={34} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Offer */}
        <View style={styles.OfferContainer} className="pl-3 pr-1">
          <OfferRender item={posts} />
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;
const styles = StyleSheet.create({
  Nav: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 7,
    //height:'auto',
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor:'gray'
  },
  container: {
    display: "flex",
    width: "100%",
    // backgroundColor:"white",
  },
  ImageContainer: {
    paddingTop: 5,
    marginTop: 20,
    height: 450,
    width: "100%",
    justifyContent: "center",
    // borderWidth:2,
  },
  DescriptionContainer: {
    backgroundColor: "white",
    height: 100,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  Desc: {
    backgroundColor: "gray",
    height: "auto",
  },
  OfferContainer: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    // paddingHorizontal: 16,
    paddingVertical: 7,
  },
  Offer: {
    //backgroundColor:"red",
    height: "97%",
  },

  container1: {
    flex: 1,
    padding: 10,
  },
  descriptionContainer: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 20,
  },
  seeMoreButton: {
    borderTopWidth: 2,
    borderTopColor: "gray",
    marginTop: 10,
    paddingTop: 10,
    alignItems: "center",
  },
});
