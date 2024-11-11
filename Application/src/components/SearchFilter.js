import React, { useState,useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput,SafeAreaView,ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { url } from "../api";


const SearchFilter = ({placeholder, Allposts,setData,setIsLoading }) => {
  const [searchText, setSearchText] = useState('');
  const All = Allposts;

  useEffect(() => {
    setIsLoading(true);
    handleSearch(searchText)
  }, [searchText]);

  const handleSearch = (text) => {
    const newData = All.filter((item) =>
    item.item_name.toLowerCase().includes(text.toLowerCase()) ||
    (item.condition && item.condition.toLowerCase().includes(text.toLowerCase())) ||
    (item.name && item.name.toLowerCase().includes(text.toLowerCase()))
    );
    setData(newData)
    if (searchText === '') setData(Allposts)
  };

  
  

  return (
    <View style={styles.container}>
      <TextInput
      className='flex-1 pl-2 text-md text-slate-400 md:text-2xl'
        // style={{ flex: 1, paddingLeft: 8, fontSize: 16, color: "#808080" }}
        placeholder={placeholder}
        clearButtonMode='always'
        onChangeText={(text) => setSearchText(text)}  
        value={searchText}
        autoCapitalize='none'
        autoCorrect={false}
      />
      {/* <TouchableOpacity> */}
        <FontAwesome name="search" size={20} color="#f96163" />
      {/* </TouchableOpacity> */}
    </View>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    borderColor: '#f96163',
    borderWidth: 2,
    alignItems: "center", // Center the content vertically
    height:'auto'
  },
});
