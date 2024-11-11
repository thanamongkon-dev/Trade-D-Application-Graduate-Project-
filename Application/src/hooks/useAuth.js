import { View, Text } from 'react-native'
import React, { useEffect, useState,useMemo  } from 'react'
import { useNavigation } from '@react-navigation/native'


export default function useAuth() {
    const [user, setUser] = useState(null)
    
    const navigation = useNavigation()

    
    
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user =>{
            // console.log('got user : ',user)
            if (user) {
                setUser(user)
                navigation.navigate('root')
            } else {
                setUser(null)
            }
        })
        
        return unsub
    },[])

    // const useUserMemo = useMemo(() => {
    //     return {user}
    // },[user])

  return {user}
}