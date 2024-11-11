import { StyleSheet, Text, View ,Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useState, useEffect } from "react";

const Notification = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  let description = "sun type talk children bend proper slow military closer tent nest touch rhythm conversation lovely equipment lay studied constantly tin electricity explanation brass lungs"

  return (
    <View style={styles.container}>
      <Text numberOfLines={showFullDescription ? undefined : 4} style={styles.descriptionText}>
        {description}
        {description}
        {description}
        {description}
        {description}
        {description}
        {description}
        {description}
      </Text>
      {!showFullDescription  ? (
        <TouchableOpacity onPress={toggleDescription}>
          <Text style={styles.seeMoreButton}>See More</Text>
        </TouchableOpacity>
      ):(
        <TouchableOpacity onPress={toggleDescription}>
          <Text style={styles.seeMoreButton}>See Less</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};




  // return (
  //   <View>
  //     <TouchableOpacity>
  //       <View style={styles.Container}>
  //         <Image source={null}  style={styles.Image}/>
  //         <Text style={styles.Text} >
  //         สินค้าที่สนใจได้จบดีลลงแล้ว
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   </View>
    
  // )
// }

export default Notification

const styles = StyleSheet.create({
  // Container:{
  //   display:'flex',
  //   flexDirection:'row',
  //   backgroundColor:'white',
  //   height:'auto',
  //   alignItems:'center',
  //   justifyContent:'flex-start',
  //   padding:15,
  //   borderBottomWidth:2,
  //   borderColor:'#CCC'
  // },
  // Image:{
  //   backgroundColor:"#CCC",
  //   width:40,
  //   height:40,
  //   borderRadius:20,
    
  // },
  // Text:{
  //   marginLeft:9,
  //   fontSize:18,
  //   flex:1,
  //   flexWrap:'wrap'
  // },
  container: {
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 20,
  },
  seeMoreButton: {
    color: 'blue',
    marginTop: 5,
  },
})