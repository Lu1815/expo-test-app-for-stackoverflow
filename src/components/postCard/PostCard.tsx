import { useRoute } from "@react-navigation/native";
import React from "react";
import { StatusBar, View } from "react-native";
import { TScreenNames } from "../../utils/lib/Consts";
import { TPostVM } from "../../utils/viewModels/PostVM";
import { BookmarkCollectionSelector } from "../bookmarkCollectionSelector/BookmarkCollectionSelector";
import { CommentsSection } from "../commentsSection/CommentsSection";
import { ModalBottomSheet } from "../modalBottomSheet/ModalBottomSheet";
import { ModalDialog } from "../modalDialog/ModalDialog";
import { OptionsList } from "../optionsList/OptionsList";
import { PostFooter } from "../postFooter/PostFooter";
import { PostHeader } from "../postHeader/PostHeader";
import { PostImage } from "../postImage/PostImage";
import Report from "../report/Report";
import { _postcardService } from "./PostCard.Services";
import { postcardStyles } from "./PostCard.Styles";

type TPostCardRouteProps = {
  post: TPostVM;
  navigatingFrom: TScreenNames;
  addStatusBarMarginTop?: boolean;
};

export const PostCard: React.FC<
  TPostVM & {
    isPopup?: boolean;
    navigatingFrom?: TScreenNames;
  }
> = ({ ...initialProps }) => {
  const route = useRoute();
  const { post: PostParam, navigatingFrom: navigatingFromParam, addStatusBarMarginTop } = (route.params as TPostCardRouteProps) || {};

  const {
    handleLikePress,
    likeIconColor,
    isLiked,
    likeIconName,
    shareMessage,
    postDetails,
    handleProfileNavigation,
    handleMapNavigation,
    postOptionsList,
    handleOptionPress,
    handleOptionsButtonPressed,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleDeleteConfirm,
    i18n,
    commentsBottomSheetRef,
    reportBottomSheetRef,
    postOptionsBottomSheetRef,
    bookmarksBottomSheetRef,
  } = _postcardService({
    uri: PostParam?.postImageUrls[0] || initialProps?.postImageUrls[0],
    postId: PostParam?.postId || initialProps?.postId,
    postLikesCount: PostParam?.likes || initialProps?.likes,
    postParam: PostParam,
  });

  const finalProps = postDetails
    ? { ...initialProps, ...postDetails }
    : initialProps;

  const {
    comments,
    likes,
    location,
    profilePictureUri,
    shares,
    tags,
    postId,
    userName,
    caption,
    isPopup,
    postImageUrls,
    navigatingFrom
  } = finalProps;

  return (
    <View style={[postcardStyles.cardContainer, { marginTop: addStatusBarMarginTop ? StatusBar.currentHeight : 0 }]}>
      <PostHeader
        profilePictureUri={profilePictureUri}
        handleOptionsButtonPress={handleOptionsButtonPressed}
        userName={userName}
        handleMapNavigation={() => handleMapNavigation(navigatingFromParam || navigatingFrom)}
        handleProfileNavigation={() => handleProfileNavigation(navigatingFromParam || navigatingFrom)}
        isPopup={isPopup}
        location={location}
      />
      <PostImage
        postImageUrls={postImageUrls}
        isPopup={isPopup}
      />

      {!isPopup && (
        <PostFooter
          comments={comments}
          caption={caption}
          tags={tags}
          userName={userName}
          likeCount={likes}
          shares={shares}
          isLiked={isLiked}
          likeIconName={likeIconName}
          likeIconColor={likeIconColor}
          handleLikePress={handleLikePress}
          commentsBottomSheetRef={commentsBottomSheetRef}
          shareMessage={shareMessage}
        />
      )}

      {/* MODALS */}
      <ModalBottomSheet
        bottomSheetModalRef={commentsBottomSheetRef}
      >
        <CommentsSection postId={postId} />
      </ModalBottomSheet>

      <ModalBottomSheet
        bottomSheetModalRef={reportBottomSheetRef}
      >
        <Report id={postId} />
      </ModalBottomSheet>

      <ModalBottomSheet
        bottomSheetModalRef={bookmarksBottomSheetRef}
      >
        <BookmarkCollectionSelector 
          postAuthor={userName}
          postId={postId}
          postThumbail={postImageUrls[0]}
          postTitle={caption}
        />
      </ModalBottomSheet>

      <ModalBottomSheet
        bottomSheetModalRef={postOptionsBottomSheetRef}
      >
        <OptionsList
          options={postOptionsList}
          onOptionPress={handleOptionPress}
        />
      </ModalBottomSheet>

      <ModalDialog
        modalText={i18n.t("postCardDeleteDialogMessageText")}
        isDeleteModalVisible={isDeleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </View>
  );
};
