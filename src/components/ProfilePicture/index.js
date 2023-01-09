import React, { useState } from "react";
import { View, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

const MyComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.cancelled) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button title="Select Image" onPress={handleImagePicker} />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

export default MyComponent;

