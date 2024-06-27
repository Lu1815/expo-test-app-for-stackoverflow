import React from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IBookmarks } from "../../utils/entities/UserDetails";
import { OptionsList } from "../optionsList/OptionsList";
import { _bookmarkcollectionselectorService } from "./BookmarkCollectionSelector.Services";
import { bookmarkcollectionselectorStyles } from "./BookmarkCollectionSelector.Styles";

interface IBookmarkCollectionSelectorProps extends IBookmarks {};

export const BookmarkCollectionSelector = ({
  postAuthor,
  postId,
  postThumbail,
  postTitle
}: IBookmarkCollectionSelectorProps ) => {
  const { 
    bookmarkCollections,
    i18n,
    savePostInBookmarkCollection
  } = _bookmarkcollectionselectorService();

  return (
    <ScrollView>
      <Text style={bookmarkcollectionselectorStyles.text}>{i18n.t("selectBookmarkCollectionText")}</Text>
      <OptionsList 
        addImage
        options={bookmarkCollections} 
        onOptionPress={(bookmark) => savePostInBookmarkCollection(bookmark, { postAuthor, postId, postThumbail, postTitle }) } 
      />
    </ScrollView>
  );
};
