import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { whiteColor } from "../../theme/Style";
import { Button } from "../button/Button";
import { UserInfo } from "../userInfo/UserInfo";
import { postheaderStyles } from "./PostHeader.Styles";

type TPostHeaderProps = {
  userName: string;
  profilePictureUri: string;
  handleMapNavigation?: () => void;
  handleProfileNavigation?: () => void;
  isPopup?: boolean;
  location?: string;
  postOptionsBottomSheetRef?: React.MutableRefObject<BottomSheetModal>;
  handleOptionsButtonPress?: () => void;
}

export const PostHeader = ({
  userName,
  profilePictureUri,
  handleMapNavigation,
  handleProfileNavigation,
  isPopup,
  location,
  postOptionsBottomSheetRef,
  handleOptionsButtonPress,
}: TPostHeaderProps) => {
  return (
    <View style={postheaderStyles.headerContainer}>
      <UserInfo
        userName={userName}
        profilePictureUri={profilePictureUri}
        handleMapNavigation={handleMapNavigation}
        handleProfileNavigation={handleProfileNavigation}
        isPopup={isPopup}
        location={location}
      />
      {!isPopup && (
        <Button
          iconName="dots-vertical"
          iconLibrary="MaterialCommunityIcons"
          iconColor="#001"
          styles={{ backgroundColor: whiteColor, shadowColor: whiteColor }}
          onPress={handleOptionsButtonPress}
        />
      )}
    </View>
  );
};
