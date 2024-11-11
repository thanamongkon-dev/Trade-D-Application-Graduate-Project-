import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Notification from '@components/Notification'

const NotiScreen = () => {
  return (
    <View className=" flex-1 bg-white "  >
      <Notification />
    </View>
  )
}

export default NotiScreen

const styles = StyleSheet.create({})