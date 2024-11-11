import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  PanResponder,
  Alert,
} from "react-native";

const CustomImageSlider = ({
  images,
  onImageClick,
  editMode,
  selectedImages,
  setSelectedImages,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  // console.log("Slider ",selectedImages)

  const handleImagePress = (index) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onRemove = (imageId, image_key) => {
    Alert.alert(
      `Delete Image ${imageId}`,
      "Are you sure you want to delete this Image?",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // Perform the actual deletion here using the postId
            console.log(`Deleting Image with ID ${imageId}`);
            onImageClick(imageId, image_key);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handlePanResponderMove = (_, gestureState) => {
    if (gestureState.dx < -50) {
      // Swipe left
      if (activeIndex < images.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else if (gestureState.dx > 50) {
      // Swipe right
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove,
    })
  ).current;

  const handleRemoveImage = (uri) => {
    setSelectedImages(selectedImages.filter((image) => image.uri !== uri));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          setActiveIndex(newIndex);
        }}
      >
        {editMode &&
          selectedImages.map((image, index) => (
            <View
              key={index}
              style={styles.imageContainer}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity onPress={() => handleImagePress(index)}>
                <Image
                  source={{ uri: image.uri }}
                  resizeMode="cover"
                  style={styles.image}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemoveImage(image.uri)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

        {images.map((image, index) => (
          <View
            key={index}
            style={styles.imageContainer}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity onPress={() => handleImagePress(index)}>
              <Image
                source={{ uri: image.imageUrl }}
                resizeMode="cover"
                style={styles.image}
                className='h-[440] md:h-[660]'
              />
            </TouchableOpacity>
            {editMode && (
              <TouchableOpacity
                onPress={() => onRemove(image.image_id, image.image_key)}
                className='absolute top-0 right-0 bg-red-600 p-1 rounded-md'
              >
                <Text className='text-white text-md md:text-xl'>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: index === activeIndex ? "#f96163" : "#ccc" },
            ]}
          />
        ))}
      </View>

      {/* Full-screen Image Modal */}
      {/* <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: images[activeIndex].imageUrl }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width < 768 ? 440:660 , // Set the desired image height
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: "white",
  },
  modalImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10, // Adjust as needed
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red", // Adjust as needed
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white", // Adjust as needed
  },
});

export default CustomImageSlider;
