import { StyleSheet,View,Text,SafeAreaView,ScrollView,StatusBar,ActivityIndicator } from "react-native";
import React, { useState,useEffect } from 'react';
import Header from "@components/Header"
import SearchFilter from "@components/SearchFilter"
import CategoriesFilter from "@components/CatagoriesFilter"
import Card from '@components/Card'
// import { usePosts } from "../hooks/usePosts";
import { url } from "../api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";


const ItemListScreen = () => {
	const [data, setData] = useState('');
	const [Allposts, setAllPosts] = useState([]);
  	const [isLoading, setIsLoading] = useState(false);
	// const { Allposts,fetchAllPosts} = usePosts();
	const first10Posts = data.slice(0, 100);
	const isFocused = useIsFocused();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(10); // Adjust the page size as needed

	useEffect(() =>{
		fetchAllPosts()
	},[isFocused])

	const fetchAllPosts = async () => {
		try {
		  const res = await url.get(`/posts/getAll`);
		  const data = res.data
		  if (!data.error) {
			setAllPosts((data));
			setData((prevData) => [...prevData, ...data]);
			setCurrentPage((prevPage) => prevPage + 1);
			// await AsyncStorage.setItem('Allposts', JSON.stringify(data));
		  }
		} catch (error) {
		  console.error("Error fetching all posts: ", error);
		}
	}

	const loadMoreData = () => {
		setIsLoading(true);
		fetchAllPosts();
		setIsLoading(false)
	}

    return (
        <SafeAreaView className='flex-1 px-4 bg-slate-100'>
            <StatusBar backgroundColor="#f96163" style="light" />

			{/* Search Filter */}
			<SearchFilter icon="search" placeholder={"Search..."} Allposts={Allposts} data={data} setData={setData} setIsLoading={setIsLoading} />

			{/* Categories filter */}

			<View style={{ marginTop: 0 }}>
				{/* Categories list */}
				<CategoriesFilter Allposts={Allposts} setData={setData} fetchAllPosts={fetchAllPosts} />
			</View>

			{/* Recipe List Filter */}

			<View style={{ marginTop: 0, flex: 1 }}>
				<Card Allposts={data.slice(0, currentPage * pageSize)} onEndReached={loadMoreData} />
			</View>
		</SafeAreaView>
    )
}

export default ItemListScreen;
const styles = StyleSheet.create({});