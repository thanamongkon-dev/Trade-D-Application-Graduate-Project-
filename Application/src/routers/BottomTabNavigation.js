import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet,useWindowDimensions } from 'react-native';
import { FontAwesome, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Header from '@components/Header'; // นี่คือการนำเข้า Header Component
import Profile from '@screens/Profile';
import ItemListScreen from "@screens/ItemListScreen";
import NotiScreen from '@screens/NotiScreen'
import CreatePostScreen from '@screens/CreatePostScreen'
import ChatList from '../screens/chat/ChatList';
import { useAuth } from "../hooks/AuthContext";
import OtherProfile from '@screens/OtherProfile';
import ChatRoom2 from "../screens/chat/ChatRoom2";


const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ label }) => (
  <View style={styles.tabBarLabelContainer} className='border-2 bg-slate-600'>
    <Text className='text-center items-center'>{label}</Text>
  </View>
);

const BottomTabNavigation = () => {
  const {user} = useAuth();
  // console.log(user)
  const { width } = useWindowDimensions();
  const iconSize = width < 768 ? 18 : 32;
  const screens = [
    { name: 'Home', component: ItemListScreen },
    { name: 'CreatePost', component: CreatePostScreen },
    { name: 'Profile', component: Profile , initialParams: { uid: user.user_id }},
    { name: 'ChatList', component: ChatList }
    //{ name: 'ChatList', component: ChatList, initialParams:{uid:user.user_id} },
  ];
  return (
    <Tab.Navigator 
      initialRouteName="Home" // กำหนดหน้าที่ควรแสดงเมื่อแอปพลิเคชันเริ่มต้น
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            return (
              <View className='items-center justify-center w-[120] '>
                <Ionicons name="home-outline" size={iconSize} color={color} />
              </View>
            )
          } else if (route.name === 'Profile') {
            iconName = 'user-o';
          } else if (route.name === 'Setting') {
            iconName = 'cog';
          } else if (route.name === 'CreatePost') {
            return (
              <View className='items-center justify-center w-[120] '>
                <Ionicons name="create-outline" size={iconSize} color={color} />
              </View>
            )
          }else if (route.name === 'ChatList'){
            return (
              <View className='items-center justify-center w-[120] '>
                <Ionicons name='ios-chatbubble-ellipses-outline' size={iconSize} color={color} />
              </View>
            )
          }

          return (
            <View className='items-center justify-center w-[120] '>
              <FontAwesome name={iconName} size={iconSize} color={color} />
            </View>
          )
        },
        tabBarLabel: ({ focused, color }) => {
          const label = route.name;
          return (
            <CustomTabBarLabel label={label} />
          );
        },
      })}
    >
      {/* <Tab.Screen 
        name="ChatList" 
        component={ChatList} 
        options={{ 
          headerShown: false,
          tabBarShowLabel:false,
          tabBarButton: () => null,
          }} /> */}
      <Tab.Screen 
        name="OtherProfile" 
        component={OtherProfile} 
        options={{ 
          headerShown: false,
          tabBarShowLabel:false,
          tabBarButton: () => null,
          }} />
      {screens.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            //headerShown: false,
            tabBarShowLabel:false,
            header: () => (
              <Header headerText={screen.name} headerIcon="bell-o" />
            ),
            tabBarActiveTintColor: "#f96163",
            tabBarInactiveTintColor: "gray",
          }}
          initialParams={screen.initialParams}
        />
      ))}
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBarLabelContainer: {
    alignItems: 'center',
  },
  // tabBarLabelText: {
  //   fontSize: 12,
  //   textAlign: 'center',
  // },
});

export default BottomTabNavigation;
