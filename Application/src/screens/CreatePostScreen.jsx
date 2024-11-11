import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
// import * as ImagePicker from "expo-image-picker";
import { url } from "@api";
import { useAuth } from "../hooks/AuthContext";
import { ImageSelect } from "../hooks/imageSelect";
import { useNavigation } from "@react-navigation/native";
import {SelectList} from 'react-native-dropdown-select-list';

const CreatePostScreen = () => {
  const primary = "#f96163";
  const { user } = useAuth();
  const {selectedImages, handleImageSelect,setSelectedImages} = ImageSelect();
  const navigation = useNavigation();

  const [createPost,setCreate] = useState({
    user_id:'',
    name:'',
    description:'',
    condition:'',
    category:""
  })
  const [AllCategory, setCategories] = useState([]);

  useEffect(() =>{
    const getCategory = async () => {
      try {
        const res = await url.get('/posts/Category')
        const data = res.data
        if (!data.error) {
          setCategories(data);
        }
      } catch (error) {
        console.error(error)
      }
    }
    getCategory()
  },[])
  let Categories = AllCategory
  .filter(item => item.category_id !== 1)
  .map(item => ({
    key: item.category_id,
    value: item.name
  }));

  

  const handleRemoveImage = (uri) => {
    setSelectedImages(selectedImages.filter((image) => image.uri !== uri));
  };

  const handlePost = async () => {
    try {
      // console.log(!createPost.name.trim())
      if (!createPost.name.trim() || !createPost.description.trim() || !createPost.condition.trim() )
      {
        alert('กรุณากรอกข้อมูลให้ครบ')
        return;
      }else if(typeof createPost.category !== 'number'){
        alert('กรุณาเลือกหมวดหมู่')
        return;
      } else if(selectedImages.length == 0){
        alert("โปรดเลือกรูป")
        return;
      }else if(selectedImages.length > 10){
        alert('คุณสามารถอัพโหลดได้สูงมาก 10 รูปเท่านั้น')
        return;
      }
      
      
      const formData = new FormData();
      formData.append("user_id", user.user_id); // Replace 'uid' with the actual user ID
      formData.append("name", createPost.name);
      formData.append("description", createPost.description);
      formData.append("condition", createPost.condition);
      formData.append("category_id", createPost.category);
      selectedImages.forEach((image) => {
        // Append each image to the FormData
        formData.append(`images`, {
          uri: image.uri,
          type: "image/jpeg", // Change the type accordingly
          name: image.filename, // Ensure 'filename' is set appropriately
        });
      });

      const response = await url.put(
        "/posts/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const responseData = response.data;

      if (responseData.status === "success") {
        alert("Post Created Successfully");
        navigation.goBack();
        setCreate({
          user_id:'',
          name:'',
          description:'',
          condition:'',
          category:''
        });
        setSelectedImages([]);
      } else {
        alert("Error creating post");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      alert("An error occurred while creating the post.");
    }
  };

  return (
    <ScrollView className="bg-slate-50">
      <View className="flex h-full w-full p-3 gap-3 justify-center">
        {selectedImages.length === 0 ? (
          <View className='h-[400px] md:h-[550] items-center justify-center border-2 border-slate-200 rounded-xl bg-white'>
            <Text className='text-md md:text-4xl'>ไม่มีรูปที่ถูกเลือก</Text>
          </View>
        ) : (
          <FlatList
            data={selectedImages}
            horizontal={true}
            renderItem={({ item }) => (
              <View className="flex h-[400px] justify-center items-center ">
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 350, height: 350 }}
                  className="rounded-xl mx-2 "
                />
                <TouchableOpacity
                  className="absolute right-[15px] top-[30px] p-3 bg-red-400 rounded-full border-slate-200 border-2"
                  onPress={() => handleRemoveImage(item.uri)}
                >
                  <Text className="text-white"> X </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}

        <TouchableOpacity onPress={() => handleImageSelect(true)}>
          <View className="w-[250px] h-[50px] md:w-[350] md:h-[70] bg-red-400 self-center justify-center items-center rounded-xl">
            <Text className="text-white text-xl md:text-3xl">เลือกรูปภาพ</Text>
          </View>
        </TouchableOpacity>

        <View className="flex w-full">
          <View>
            <Text className="text-lg md:text-2xl font-bold ">ชื่อสินค้า</Text>
            <KeyboardAvoidingView
              keyboardVerticalOffset={100}
              // style={{ width: "100%" }}
              className='w-full bg-white border-slate-200 border-2 rounded-lg h-auto'
            >
              <TextInput
                onChangeText={(text) => setCreate({...createPost,name:text})}
                multiline
                editable
                clearButtonMode='always'
                autoCapitalize='none'
                spellCheck={false}
                placeholder="ชื่อสินค้าของคุณ"
                className="p-2 text-md md:text-2xl h-12 w-full"
              />
            </KeyboardAvoidingView>
          </View>

          <View>
            <Text className="text-lg md:text-2xl font-bold ">เงื่อนไขการแลกเปลี่ยน</Text>
            <KeyboardAvoidingView
              keyboardVerticalOffset={100}
              // style={{ width: "100%" }}
              className='w-full bg-white border-slate-200 border-2 rounded-lg h-auto'
            >
              <TextInput
                onChangeText={(text) => setCreate({...createPost,condition:text})}
                multiline
                editable
                clearButtonMode='always'
                autoCapitalize='none'
                spellCheck={false}
                placeholder="เงื่อนไขการแลกเปลี่ยน"
                className="p-2 text-md md:text-2xl h-12 w-full"
              />
            </KeyboardAvoidingView>
          </View>
          
          <View>
            <Text className="text-lg md:text-2xl font-bold ">รายละเอียด</Text>
            <KeyboardAvoidingView
              keyboardVerticalOffset={100}
              // style={{ width: "100%" }}
              className='w-full bg-white border-slate-200 border-2 rounded-lg h-[200]'
            >
              <TextInput
                onChangeText={(text) => setCreate({...createPost,description:text})}
                multiline
                editable
                clearButtonMode='always'
                autoCapitalize='none'
                spellCheck={false}
                maxLength={40}
                placeholder="ใส่รายละเอียดที่นี่"
                className="p-2 text-md md:text-2xl h-auto w-full"
              />
            </KeyboardAvoidingView>
          </View>
          

          <Text
            className="text-lg md:text-2xl font-bold mr-3 mb-1"
          >
            หมวดหมู่:
          </Text>
          {/* add category multiple checkbox here */}
          <SelectList
                data={Categories}
                // defaultOption={Categories.find((category) => category.key === createPost.category)}
                setSelected={(val) => setCreate({...createPost,category:val})}
                placeholder="เลือกหมวดหมู่"
                boxStyles={{borderRadius:8, borderWidth:2,borderColor:"#E2E8F0",backgroundColor:"#FFF"}}
                dropdownStyles={{borderWidth:2,borderColor:"#E2E8F0",backgroundColor:"#FFF"}}
          />

        </View>
        <TouchableOpacity onPress={handlePost}>
          <View className="w-[250px] h-[50px] md:w-[350] md:h-[70] bg-red-400 self-center justify-center items-center rounded-xl">
            <Text className="text-white font-semibold text-xl md:text-2xl">โพสต์</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreatePostScreen;
