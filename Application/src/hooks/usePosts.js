import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/AuthContext";
import { url } from "../api";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const deletePost = async (postId) => {
  try {
    await url.delete(`/posts/${postId}`);
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
};

export const usePosts = (id) => {
  const [OtherInfo, setOtherInfo] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [Id, setId] = useState('');
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const uid = user.user_id;

  const fetchUserData = useCallback(async (userId) => {
    try {
      const res = await url.get(`/user/${userId}`);
      setUserInfo(res.data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }, []);

  const fetchPostsByUser = useCallback(async () => {
    try {
      const res = await url.get(`/posts/user_PTC/${uid}`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    }
  }, [uid]);

  

  const fetchData = useCallback(async () => {
    try {
      setId(id);
      setLoading(true);
      // await fetchAllPosts();
      // await fetchOtherData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data: ", error);
    }
  }, [
    id, 
    // fetchOtherData
  ]);

  // useEffect(() => {
  //   const checkAllposts = async () => {
  //     try {
  //       const AllData = await AsyncStorage.getItem('Allposts');
  //       if (AllData) {
  //         // console.log(JSON.parse(userData))
  //         setAllPosts(JSON.parse(AllData));
  //       }
  //     } catch (error) {
  //       console.error('Error reading user data from AsyncStorage:', error);
  //     }
  //   };

  //   checkAllposts();
  // }, []);

  useEffect(() => {
    fetchUserData(user.user_id);
  }, [user.user_id, fetchUserData]);

  useEffect(() => {
    fetchPostsByUser();
  }, [fetchPostsByUser]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  return { 
    posts, 
    OtherInfo, 
    loading, 
    uid, 
    usePosts, 
    userInfo,
    fetchPostsByUser
  };
};
