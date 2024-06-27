import React from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { primaryColor } from "../../theme/Style";
import { TPostVM } from "../../utils/viewModels/PostVM";
import { _imageselectorService } from "./ImageSelector.Services";
import { imageselectorStyles } from "./ImageSelector.Styles";

type TImageSelectorProps = {
  posts: TPostVM[];
  onSelectionChange: (selectedImages: string[]) => void;
}

const ImageSelector = ({ posts, onSelectionChange }: TImageSelectorProps) => {
  const { i18n, selectedImages, toggleSelection } = _imageselectorService(onSelectionChange);

  const renderImageItem = ({ item }) => {
    const isSelected = selectedImages.includes(item.postId);
    return (
      <TouchableOpacity onPress={() => toggleSelection(item.postId)}>
        <View style={imageselectorStyles.imageWrapper}>
          <Image source={{ uri: item.postImageUrls[0] }} style={imageselectorStyles.image} />
          {isSelected && (
            <View style={imageselectorStyles.overlay}>
              <Icon name="check-circle" size={24} color={primaryColor} /> 
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={imageselectorStyles.container}>
      <FlatList
        data={posts}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.postId}
        numColumns={3}
        extraData={selectedImages}
      />
      <View style={imageselectorStyles.selectedCount}>
        <Text>{i18n.t("selectedPostsText")} {selectedImages.length}</Text>
      </View>
    </View>
  );
};

export default ImageSelector;
