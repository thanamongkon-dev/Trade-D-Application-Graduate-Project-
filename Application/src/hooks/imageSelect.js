import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

export const ImageSelect = () => {
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            console.error("Permission to access media library denied");
          }
        };
    }, []);

    const handleImageSelect = async (multiSelect) => {
        try {
          const imagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: multiSelect ? [4, 3] : [1, 1],
            allowsMultipleSelection: multiSelect,
          };
      
          // Include allowsEditing only if multiSelect is false
          if (!multiSelect) {
            imagePickerOptions.allowsEditing = true;
          }
      
          const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
          // Single Image
          if (!multiSelect) {
            if (!result.canceled) {
              const selectedImage = {
                uri: result.assets[0].uri,
                filename: result.assets[0].fileName || `image-${Date.now()}.jpg`,
              };
              setSelectedImages([selectedImage]);
            }
          } else {
            // Multiple Images
            if (!result.canceled) {
              const newImages = result.assets.map((asset) => ({
                uri: asset.uri,
                filename: asset.fileName || `image-${Date.now()}.jpg`,
              }));
      
              const uniqueImages = newImages.filter(
                (newImage) =>
                  !selectedImages.some(
                    (selectedImage) => selectedImage.uri === newImage.uri
                  )
              );
      
              setSelectedImages([...selectedImages, ...uniqueImages]);
            }
          }
        } catch (error) {
          console.error("Error selecting image:", error);
        }
    };

    return {selectedImages, handleImageSelect,setSelectedImages}
}