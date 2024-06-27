import React from "react";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type TUserInfo = {
  handleMapNavigation?: () => void;
  handleProfileNavigation?: () => void;
  isPopup?: boolean; // TO CHECK IF THE USER INFO IS BEING USED IN A MAP POPUP
  location?: string;
  locationPinIcon?: React.JSX.Element;
  profilePictureUri: string;
  userName: string;
  profilePictureStyle?: ImageStyle | ImageStyle[];
  userNameStyle?: TextStyle | TextStyle[];
  caption?: string;
  fullName?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  textContainerStyle?: ViewStyle | ViewStyle[];
};
