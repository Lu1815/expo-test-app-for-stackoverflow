import React from "react";
import {
  Image,
  ImageStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { imagelistStyles } from "./ImageList.Styles";

interface ImageListProps {
  images: string[];
  onRemove: (index: number) => void;
  containerStyle?: ViewStyle | ViewStyle;
  imageContainerStyle?: ViewStyle | ViewStyle;
  imageStyle?: ImageStyle | ImageStyle;
  removeButtonStyle?: ViewStyle | ViewStyle[];
}

/*
* ImageList component is a simple component that displays a list of images with a remove button.
* It takes an array of image URIs and a callback function to remove an image from the list.
* It also accepts optional styles for the container, image container, image, and remove button.
* The component uses the imagelistStyles from ImageList.Styles.ts to style the components.
* 
* @images: An array of image URIs to display.
* @onRemove: A callback function to remove an image from the list.
* @containerStyle: Optional style for the container View.
* @imageContainerStyle: Optional style for the image container View.
* @imageStyle: Optional style for the Image component.
*/
const ImageList: React.FC<ImageListProps> = ({
  images,
  onRemove,
  containerStyle,
  imageContainerStyle,
  imageStyle,
  removeButtonStyle,
}: ImageListProps) => {
  return (
    <View style={[imagelistStyles.imageListContainer, containerStyle]}>
      {images.map((uri, index) => (
        <View key={index} style={[imagelistStyles.imageContainer, imageContainerStyle]}>
          <Image source={{ uri }} style={[imagelistStyles.image, imageStyle]} />
          <TouchableOpacity
            style={[imagelistStyles.removeButton, removeButtonStyle]}
            onPress={() => onRemove(index)}
          >
            <Icon name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ImageList;
