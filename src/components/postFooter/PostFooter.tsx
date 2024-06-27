import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import { primaryColor } from "../../theme/Style";
import { Button } from "../button/Button";
import { _postfooterService } from "./PostFooter.Services";
import { postFooterStyles } from "./PostFooter.Styles";

type TPostFooter = {
  caption?: string;
  tags?: string[];
  userName: string;
  likeCount: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  likeIconName: string;
  likeIconColor: string;
  handleLikePress: () => void;
  commentsBottomSheetRef: React.MutableRefObject<BottomSheetModal>;
  shareMessage: () => void;
};

export const PostFooter = ({
  caption,
  tags,
  userName,
  likeCount,
  comments,
  shares,
  isLiked,
  likeIconName,
  likeIconColor,
  handleLikePress,
  commentsBottomSheetRef,
  shareMessage,
}: TPostFooter) => {
  const {
    i18n
  } = _postfooterService();

  return (
    <View>
      <View style={postFooterStyles.contentContainer}>
        {caption && (
          <View style={postFooterStyles.descriptionContainer}>
            <Text style={postFooterStyles.description}>
              <Text style={postFooterStyles.username}>
                {userName}
                <Text style={postFooterStyles.caption}>{` ${caption}`}</Text>
              </Text>
            </Text>
          </View>
        )}
        <View style={postFooterStyles.tagContainer}>
          {tags &&
            tags.map((tag, index) => (
              <View key={index} style={postFooterStyles.tagPill}>
                <Text style={postFooterStyles.tagText}>{tag}</Text>
              </View>
            ))}
        </View>
        <Text style={postFooterStyles.likesComments}>
          {i18n.t("postCardLikesText")}: {likeCount} -{" "}
          {i18n.t("postCardCommentsText")}: {comments} -{" "}
          {i18n.t("postCardSharesText")}: {shares}
        </Text>
      </View>

      <View style={postFooterStyles.buttonContainer}>
        <Button
          text={
            isLiked
              ? `${i18n.t("postCardDislikeButtonText")}`
              : `${i18n.t("postCardLikeButtonText")}`
          }
          styles={postFooterStyles.button}
          textStyle={postFooterStyles.buttonText}
          onPress={handleLikePress}
          iconLibrary="MaterialCommunityIcons"
          iconName={likeIconName}
          iconColor={likeIconColor}
          iconSize={24}
        />
        <Button
          text={i18n.t("postCardCommentButtonText")}
          styles={postFooterStyles.button}
          textStyle={postFooterStyles.buttonText}
          onPress={commentsBottomSheetRef.current?.present}
          iconLibrary="MaterialCommunityIcons"
          iconName="comment-outline"
          iconColor={primaryColor}
          iconSize={20}
        />
        <Button
          text={i18n.t("postCardShareButtonText")}
          styles={postFooterStyles.button}
          textStyle={postFooterStyles.buttonText}
          onPress={shareMessage}
          iconLibrary="MaterialCommunityIcons"
          iconName="share-outline"
          iconColor={primaryColor}
          iconSize={24}
        />
      </View>
    </View>
  );
};
