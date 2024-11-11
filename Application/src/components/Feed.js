import React , { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList,Image,SectionList } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import axios from "axios";
import {getPosts} from "../api"


const Feed = () => {
  const [posts,setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  },[]);

  const fetchPosts = async () => {
    try {
      const res = await getPosts()
      // console.log(res.data);
      setPosts(res.data)
    } catch (error) {
      console.error("Error fetching posts: ",error)
    }
  };
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const sections = [
    {
      title: "User's Posts",
      data: posts,
    },
  ];

    const renderPost = ({ item }) => (
          <Card style={styles.card}>
          <Card.Title
            title={item.name}
            left={(props) => (
              <Avatar.Image size={40} source={{uri:item.avatar}} />
            )}
          />
          <Card.Content>
            <Text style={styles.postContent}>{item.content}</Text>
            <View style={styles.imageContainer}>
              <Image source={{uri:item.images}} style={styles.postImage} />
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
        <Button onPress={() => toggleLike(item.id)}>
          {likedPosts.includes(item.id) ? "Unlike" : "Like"}
        </Button>
        <Button>Comment</Button>
        <Button>Share</Button>
      </Card.Actions>
      </Card>
      );
    
      

      return (
        // <View style={styles.container}>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.pid}
            style={{ flex: 1, width: "100%" }}
          />

        

        // </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        width: '100%',
        flex: 1,
        backgroundColor: "#f0f0f0",
      },
      card: {
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
        backgroundColor: "white",
      },
      postContent: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
      },
      imageContainer: {
        alignItems: "center",
        marginTop: 8,
      },
      postImage: {
        width: "100%",
        height: 500, // Adjust as needed
        resizeMode: 'cover',
        borderRadius: 8,
      },
      cardActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 8,
      },
    });
    

export default Feed;
