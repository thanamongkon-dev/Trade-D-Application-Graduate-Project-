import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

const profile = "https://e1.pxfuel.com/desktop-wallpaper/703/832/desktop-wallpaper-45-tanjiro-ideas-tanjiro-smile.jpg"


const ProfileHead = () => {
  return (
    <View style={styles.Container}>
      {/* background wallpaper */}
      <View style={styles.BgContainer}>
        <Image source={{uri:profile}} style={styles.BG}/>
      </View>
       {/* ProfileImg In the Middle */}
      <View style={styles.proCon}>
        <Image source={{uri:profile}} style={styles.Pro}/>
      </View>
      {/* UserInfo that want a nice color fade with background wallpaper */}
      <View style={styles.Info}>
        <Text style={{ textAlign:'center', fontSize:24, fontWeight:700 }}>
           UserName 
        </Text>
        <Text style={{ textAlign:'center', fontSize:20, fontWeight:400 }}>
          Somethings Here 1
        </Text>
        <Text style={{ textAlign:'center', fontSize:20, fontWeight:400 }}>
          Somethings Here 2
        </Text>
      </View>
    </View>
  )
}

export default ProfileHead

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
    width: '100%',
    height: '65%',
    backgroundColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BgContainer: {
    display: 'flex',
    height: '50%',
    backgroundColor: 'white',
  },
  BG: {
    flexShrink: 0,
    width: 'auto',
    height: '100%',
    resizeMode: 'cover',
  },
  Info: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 64,
    paddingBottom: 21,
    paddingLeft: 129,
    paddingRight: 127,
    backgroundColor: '#FFF',
    // Add elevation for Android and shadow properties for iOS
    elevation: 5, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 25,
  },
  proCon: {
    width: 200,
    height: 200,
    flexShrink: 0,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    marginTop: 109,
  },
  Pro: {
    width: 200,
    height: 200,
    flexShrink: 0,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    // marginTop: 109,
  },
});