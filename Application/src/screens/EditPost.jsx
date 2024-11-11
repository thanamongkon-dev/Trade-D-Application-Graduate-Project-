import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  useWindowDimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CustomImageSlider from "@components/CustomImageSlider";
import { url } from "@api";
import { ImageSelect } from "../hooks/imageSelect";
import {SelectList} from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';

const primary = "#f96163";

const EditPost = ({ navigation, route }) => {
  const [imagesUrl, setImages] = useState([]);
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 28 : 34;
  
  const items = route.params.post;
  // console.log(items)
  const [item, setItem] = useState({
    item_id: items.item_id,
    name: items.item_name,
    description: items.description,
    condition: items.condition,
    category_id: items.category_id,
    status: items.status,
  });

  const [AllCategory, setCategories] = useState([]);
  let Categories = AllCategory
  .filter(item => item.category_id !== 1)
  .map(item => ({
    key: item.category_id,
    value: item.name
  }));

  let status = [
    {key:1,value:'Pending'},
    {key:2,value:'Complete'},
    {key:3,value:'Cancel'}
  ]

  const { selectedImages, handleImageSelect, setSelectedImages } =
    ImageSelect();

  useEffect(() => {
    fetchDetail(items.item_id);

  }, []);

  const fetchDetail = async (id) => {
    try {
      const res = await url.get(`/posts/${id}`);
      const AllCategory = await AsyncStorage.getItem('AllCategory');
      setCategories(JSON.parse(AllCategory));
      setImages(res.data.images);
    } catch (error) {
      console.error(error);
    }
  };

  const removeImage = async (id, key) => {
    try {
      console.log({
        ID: id,
        Key: key,
      });
      const updatedImages = imagesUrl.filter((image) => image.image_id !== id);
      const res = await url.delete(`/posts/ImageDelete/${id}/${key}`);
      const responseData = res.data;

      if (responseData.status === "success") {
        setImages(updatedImages);
      } else {
        alert("Error creating post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(selectedImages.length + imagesUrl.length)
  let MaxImages = selectedImages.length + imagesUrl.length

  const UpdatePost = async () => {
    try {
      if (selectedImages.length !== 0) {
        if(MaxImages > 10){
          alert('คุณสามารถอัพโหลดได้สูงมาก 10 รูปเท่านั้น')
          return;
        }
        const formData = new FormData();
        selectedImages.forEach((image) => {
          formData.append(`images`, {
            uri: image.uri,
            type: "image/jpeg",
            name: image.filename,
          });
        });
        const res = await url.put("/posts/updateImages/" + items.item_id, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const responseData = res.data;
        if (responseData.status !== "success") {
            alert(" Upload Images Fail")
        }
      }
      const res = await url.put(`/posts/update/${item.item_id}`, item);
      const responseData = res.data;
      if (responseData.status === "success") {
        alert("อัพเดท สำเร็จ");
        navigation.goBack();
      } else {
        alert("Error creating post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="bg-white h-full flex-col w-full">
      <SafeAreaView className="flex-row w-full h-12 items-center justify-between px-4">
        <Pressable onPress={() => navigation.goBack()}>
          <FontAwesome name={"arrow-circle-left"} size={iconSize} color="#f96163" />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>EditPost</Text>
        <TouchableOpacity onPress={() => handleImageSelect(true)}>
          <MaterialCommunityIcons name="image-plus" size={iconSize} color="#f96163" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView>
        <View>
          <CustomImageSlider
            images={imagesUrl}
            onImageClick={removeImage}
            editMode={true}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        </View>

        <View className="mx-3">
          <View className="my-3 h-auto border-gray-300">
            <Text className=" font-bold text-lg md:text-2xl"> สถานะ </Text>
            <SelectList
                data={status}
                defaultOption={status.find((status) => status.value === item.status)}
                setSelected={(val) => setItem({...item,status:val})}
                placeholder="เลือกหมวดหมู่"
                save='value'
                boxStyles={{borderRadius:8, borderWidth:2,borderColor:"#E2E8F0",backgroundColor:"#FFF"}}
                dropdownStyles={{borderWidth:2,borderColor:"#E2E8F0",backgroundColor:"#FFF"}}
          />
          </View>

          <View className="my-3 h-auto border-gray-300 ">
            <Text className=" font-bold text-lg md:text-2xl"> ชื่อสินค้า </Text>
            <TextInput
              value={item.name}
              onChangeText={(text) => setItem({ ...item, name: text })}
              multiline
              spellCheck={false}
              className="h-16 bg-slate-200 rounded-lg pl-2 text-md md:text-xl"
            />
          </View>

          <View className="my-3 h-auto border-gray-300 ">
            <Text className=" font-bold text-lg md:text-2xl"> เงื่อนไขการแลกเปลี่ยน </Text>
            <TextInput
              value={item.condition}
              onChangeText={(text) => setItem({ ...item, condition: text })}
              multiline
              spellCheck={false}
              className="h-16 bg-slate-200 rounded-lg pl-2 text-md md:text-xl"
            />
          </View>

          <View className=" flex my-3 h-auto border-gray-300 ">
            <Text className=" font-bold text-lg md:text-2xl"> แก้ไขเนื้อหาโพสต์ </Text>
            <TextInput
              value={item.description}
              onChangeText={(text) => setItem({ ...item, description: text })}
              multiline
              spellCheck={false}
              className="h-auto bg-slate-200 rounded-lg px-2 py-3 text-md md:text-xl"
            />
          </View>

          <View className="my-3 h-auto border-gray-300">
            <Text className=" font-bold text-lg md:text-2xl"> หมวดหมู่ </Text>
            <SelectList
                data={Categories}
                defaultOption={Categories.find((category) => category.key === items.category_id)}
                setSelected={(val) => setItem({...item,category_id:val})}
                placeholder="เลือกหมวดหมู่"
                save=""
                boxStyles={{borderRadius:8, borderWidth:2,borderColor:"#E2E8F0",backgroundColor:"#FFF"}}
                dropdownStyles={{borderWidth:2,borderColor:"#E2E8F0",backgroundColor:"#FFF"}}
          />
          </View>

          <View className="flex flex-row items-center justify-around w-full h-auto my-4">
            <TouchableOpacity
              onPress={UpdatePost}
              className="flex-row flex bg-green-400 items-center justify-center w-1/3 h-12 md:h-16 rounded-lg"
            >
              <FontAwesome5 name={"save"} size={iconSize} color={"#FFF"} />
              <Text className="text-white font-bold text-xl md:text-3xl"> Save </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: primary }}
              className="flex-row flex items-center justify-center w-1/3 h-12 md:h-16 rounded-lg"
            >
              <MaterialIcons name={"cancel"} size={iconSize} color={"#FFF"} />
              <Text className="text-white font-bold text-xl md:text-3xl"> Cancel </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditPost;
const styles = StyleSheet.create({
  Nav: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 7,
    //height:'auto',
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    //backgroundColor:'gray'
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  ImageContainer: {
    paddingTop: 5,
    height: 300,
    width: "100%",
    justifyContent: "center",
  },
  Image: {
    backgroundColor: "gray",
    // maxWidth:'100%',
    height: "94%",
    margin: 16,
  },
  DescriptionContainer: {
    backgroundColor: "white",
    height: 100,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  Desc: {
    //backgroundColor:"gray",
    height: "97%",
  },
  OfferContainer: {
    //backgroundColor:"white",
    height: "100%",
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  Offer: {
    //backgroundColor:"red",
    height: "97%",
  },
});
