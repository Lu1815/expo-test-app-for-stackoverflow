import { useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { Button } from "../../../../components/button/Button";
import { Input } from "../../../../components/input/Input";
import { primaryColor } from "../../../../theme/Style";
import { _createbookmarkcollectionService } from "./CreateBookmarkCollection.Services";
import { createbookmarkcollectionStyles } from "./CreateBookmarkCollection.Styles";

type TCreateBookmarkCollectionRouteParams = {
  postIds: string[];
}

export const CreateBookmarkCollection = ({ selectedPostIds }) => {
  const route = useRoute();
  const { postIds } = route.params as TCreateBookmarkCollectionRouteParams || {};
  const { 
    collectionName, 
    coverImageUrl, 
    formik,
    i18n, 
    navigation,
    setCollectionName 
  } = _createbookmarkcollectionService({  selectedPostIds: postIds || selectedPostIds });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          text={i18n.t("createBookmarkCollection")}
          textStyle={{ color: primaryColor }}
          onPress={formik.handleSubmit}
          style={createbookmarkcollectionStyles.menuButton}
        />
      ),
    });
  }, []);

  return (
    <View style={createbookmarkcollectionStyles.container}>
      {coverImageUrl ? (
        <Image
          source={{ uri: coverImageUrl }}
          style={createbookmarkcollectionStyles.coverImage}
        />
      ) : (
        <View style={createbookmarkcollectionStyles.coverImagePlaceholder} />
      )}
      <Text style={createbookmarkcollectionStyles.changeCoverText}>
        {i18n.t("coverImageText")}
      </Text>
      <Input
        style={createbookmarkcollectionStyles.input}
        placeholder="Collection Name"
        value={formik.values.collectionName}
        onChangeText={formik.handleChange("collectionName")}
        onBlur={formik.handleBlur("collectionName")}
      />
      {
        formik.errors.collectionName && formik.touched.collectionName && (
          <Text style={createbookmarkcollectionStyles.errorText}>
            {formik.errors.collectionName}
          </Text>
        )
      }
    </View>
  );
};
