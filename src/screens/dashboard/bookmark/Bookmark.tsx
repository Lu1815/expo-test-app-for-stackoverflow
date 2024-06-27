import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../../components/button/Button";
import { ModalDialog } from "../../../components/modalDialog/ModalDialog";
import { primaryColor } from "../../../theme/Style";
import { useNavigationGH } from "../../../utils/hooks/UseNavigation";
import { ScreenRoutes } from "../../../utils/lib/Consts";
import { IOptionsVM } from "../../../utils/viewModels/ReportsCategoriesVM";
import { _bookMarkServices } from "./Bookmark.Services";
import { bookmarkStyles } from "./Bookmark.Styles";

const DEFAULT_IMAGE = process.env.EXPO_PUBLIC_DEFAULT_BOOKMARK_IMAGE;

export const Bookmark = () => {
  const { navigation } = useNavigationGH();
  const { 
    bookmarkCollections, 
    collectionIdRef,
    handleBookmarkFeedNavigation, 
    handleDeleteConfirm,
    i18n,
    isDeleteModalVisible,
    setDeleteModalVisible
  } = _bookMarkServices();

  function drawList() {
    return bookmarkCollections.map((bookmark: IOptionsVM, index: number) => (
      <View
        key={index}
        style={{
          flexDirection: "column",
          width: "45%",
          justifyContent: bookmarkCollections.length > 1 ? "center" : "flex-start",
        }}
      >
        <TouchableOpacity
          key={index}
          onPress={() => handleBookmarkFeedNavigation(bookmark.id)}
          onLongPress={() => {
            setDeleteModalVisible(true)
            collectionIdRef.current = bookmark.id;
          }}
          style={{
            height: 100,
            padding: 1,
            borderWidth: 0.5,
            borderRadius: 20,
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 20,
            }}
            source={{
              uri: (bookmark.optionImage && bookmark.optionImage.length > 0) ? bookmark.optionImage : DEFAULT_IMAGE,
            }}
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
          {bookmark.name}
        </Text>
      </View>
    ));
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate(ScreenRoutes.BOOKMARK_ADD_COLLECTION)}
          iconLibrary="MaterialCommunityIcons"
          iconName="plus"
          iconSize={32}
          iconColor={primaryColor}
          style={bookmarkStyles.menuButton}
        />
      ),
    });
  }, []);

  return (
    <>
      <ScrollView
        style={{ flex: 1, marginTop: StatusBar.currentHeight, gap: 10 }}
      >
        <View
          style={{
            padding: 5,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: bookmarkCollections.length > 1 ? "center" : "flex-start",
            gap: 10,
          }}
        >
          {drawList()}
        </View>
      </ScrollView>
      <ModalDialog
        modalText={i18n.t("bookmarkDeleteCollectionText")}
        isDeleteModalVisible={isDeleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteConfirm={() => handleDeleteConfirm(collectionIdRef.current)}
      />
    </>
  );
};
