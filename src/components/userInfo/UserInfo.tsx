import React from "react";
import { Image, ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Image as ImageSvg, Svg } from "react-native-svg";
import MIcon from "react-native-vector-icons/MaterialIcons";
import { primaryColor } from "../../theme/Style";
import { userinfoStyles } from "./UserInfo.Styles";

type TUserInfo = {
  caption?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  fullName?: string;
  handleMapNavigation?: () => void;
  handleProfileNavigation?: () => void;
  isPopup?: boolean; // TO CHECK IF THE USER INFO IS BEING USED IN A MAP POPUP
  location?: string;
  locationPinIcon?: React.JSX.Element;
  profilePictureStyle?: ImageStyle | ImageStyle[];
  profilePictureUri: string;
  textContainerStyle?: ViewStyle | ViewStyle[];
  userName: string;
  userNameStyle?: TextStyle | TextStyle[];
};

export const UserInfo = (props: TUserInfo) => {
  const { 
    caption,
    containerStyle,
    fullName,
    handleMapNavigation,
    handleProfileNavigation,
    isPopup = false,
    location,
    locationPinIcon,
    profilePictureStyle,
    profilePictureUri,
    textContainerStyle,
    userName,
    userNameStyle,
  } = props;

  const defaultLocationPinIcon = (
    <MIcon name="location-pin" size={13} color={primaryColor} />
  );

  return (
    <View style={[userinfoStyles.userInfoContainer, containerStyle]}>
      <TouchableOpacity
        onPress={handleProfileNavigation}
        style={isPopup && { marginRight: 5 }}
      >
        {isPopup ? (
          <Svg width={20} height={20}>
            <ImageSvg
              width={"100%"}
              height={"100%"}
              preserveAspectRatio="xMidYMid slice"
              href={
                profilePictureUri
                  ? profilePictureUri
                  : "../../../assets/atardecer_dos.png"
              }
            />
          </Svg>
        ) : (
          <Image
            source={
              profilePictureUri
                ? { uri: profilePictureUri }
                : require("../../../assets/atardecer_dos.png")
            }
            style={[userinfoStyles.profilePicture, profilePictureStyle]}
          />
        )}
      </TouchableOpacity>
      
      <View style={[userinfoStyles.headerText, textContainerStyle]}>

        <TouchableOpacity onPress={handleProfileNavigation}>
          <Text style={[userinfoStyles.username, userNameStyle]}>{userName}</Text>
        </TouchableOpacity>
        {
          fullName && (
            <Text style={userinfoStyles.fullName}>
              {fullName}
            </Text>
          )
        }

        {
          caption && (
            <View style={userinfoStyles.captionContainer}>
              <Text style={userinfoStyles.caption}>
                {caption}
              </Text>
            </View>
          )
        }

        {location ? (
          <TouchableOpacity onPress={handleMapNavigation}>
            <Text style={userinfoStyles.location}>
              {locationPinIcon ? locationPinIcon : defaultLocationPinIcon}
              {location.length > 30 ? location.slice(0, 30) + "..." : location}
            </Text>
          </TouchableOpacity>
        ) : null}

      </View>
    </View>
  );
};
