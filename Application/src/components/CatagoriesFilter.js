import React, { useState,useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categories, colors } from "../Constant"; // Make sure you have the correct path
import { url } from "../api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoriesFilter = ({Allposts,setData,fetchAllPosts}) => {
  const [activeCategory, setActiveCategory] = useState(1);
  const [Categories, setCategories] = useState([]);
  const All = Allposts;

  const handleCategoryClick = async (categoryId) => {
    // console.log(categoryId)
    setActiveCategory(categoryId);
    const nowSelect = All.filter((item) => item.category_id === categoryId);
    setData(nowSelect);
    if (categoryId == 1  || '') setData(Allposts)
  };

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const AllCategory = await AsyncStorage.getItem('AllCategory');
        if (AllCategory) {
          // console.log(JSON.parse(userData))
          setCategories(JSON.parse(AllCategory));
        }
      } catch (error) {
        console.error('Error reading user data from AsyncStorage:', error);
      }
    };

    getAllCategory();
    getCategory()
  }, []);

  const getCategory = async () => {
    try {
      const res = await url.get('/posts/Category')
      const data = res.data
      if (!data.error) {
        setCategories(data);
        handleCategoryClick(1)
        await AsyncStorage.setItem('AllCategory', JSON.stringify(data));
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Categories.map((categoryItem,i) => {
          const isActive = activeCategory === categoryItem.category_id;

          return (
            <TouchableOpacity
              key={i}
              className="mr-4 px-4 py-2 rounded-lg justify-center items-center shadow-md shadow-gray-300 shadow-opacity-100 my-2 w-100 h-50"
              style={{
                backgroundColor: isActive ? colors.COLOR_PRIMARY : colors.COLOR_LIGHT,
                borderColor:isActive ? colors.COLOR_LIGHT : colors.COLOR_PRIMARY,
                borderWidth:2,
              }}
              onPress={() => handleCategoryClick(categoryItem.category_id)}
            >
              <Text
                style={{
                  color: isActive ? colors.COLOR_LIGHT : colors.COLOR_PRIMARY,
                }}
                className='text-lg md:text-2xl'
              >
                {categoryItem.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoriesFilter;

const styles = StyleSheet.create({});
