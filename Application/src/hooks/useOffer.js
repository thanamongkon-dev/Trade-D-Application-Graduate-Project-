import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/AuthContext";
import { url } from "../api";

export const useOffer = () => {
    const { user } = useAuth();

    const [offerList, setOfferList] = useState([]);
    

    const getOffer = async (item_id) => {
        try {
            const res = await url.get('/offer/getOffers/'+item_id)
            setOfferList(res.data)
        } catch (error) {
            console.error("Error fetching Offer data: ",error);
        }
    }

    
}