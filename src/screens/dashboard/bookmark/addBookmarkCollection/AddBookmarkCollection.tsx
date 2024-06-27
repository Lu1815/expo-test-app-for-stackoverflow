import { useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "../../../../components/button/Button";
import ImageSelector from "../../../../components/imageSelector/ImageSelector";
import { primaryColor } from "../../../../theme/Style";
import { _addbookmarkcollectionService } from "./AddBookmarkCollection.Services";
import { addbookmarkcollectionStyles } from "./AddBookmarkCollection.Styles";

type TAddBookmarkCollectionRouteParams = {
  addPostsToExistingCollection: boolean;
  collectionId: string;
};

export const AddBookmarkCollection = () => {
  const route = useRoute();
  const { addPostsToExistingCollection, collectionId } =
    (route.params as TAddBookmarkCollectionRouteParams) || {};

  const {
    addPostsToCollection,
    handleNavigateToCreateBookmarkCollection,
    handleSelectionChange,
    navigation,
    posts,
    selectedImages,
    i18n,
  } = _addbookmarkcollectionService();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        addPostsToExistingCollection ? (
          <Button
            text={i18n.t("addPostsToCollectionText")}
            onPress={() => addPostsToCollection(collectionId)}
            style={addbookmarkcollectionStyles.menuButtonContainer}
            textStyle={addbookmarkcollectionStyles.menuButtonText}
          />
        ) : (
          <Button
            onPress={handleNavigateToCreateBookmarkCollection}
            iconLibrary="MaterialCommunityIcons"
            iconName="arrow-right-circle-outline"
            iconSize={32}
            iconColor={primaryColor}
            style={addbookmarkcollectionStyles.menuButton}
          />
        ),
    });
  }, []);

  if(posts.length === 0 || !posts) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <MaterialCommunityIcons name="image-off" size={100} color="#6D6D6D" />
        <Text style={{ textAlign: 'center', fontSize: 18 }}>{i18n.t('noBookmarksToAdd')}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageSelector posts={posts} onSelectionChange={handleSelectionChange} />
    </View>
  );
};
