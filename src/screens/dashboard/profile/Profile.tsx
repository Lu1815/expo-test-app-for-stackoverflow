import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheet } from "../../../components/bottomSheet/BottomSheet";
import { Button } from "../../../components/button/Button";
import { Map } from "../../../components/map/Map";
import { ModalBottomSheet } from "../../../components/modalBottomSheet/ModalBottomSheet";
import { OptionsList } from "../../../components/optionsList/OptionsList";
import Report from "../../../components/report/Report";
import Tabs from "../../../components/tabs/Tabs";
import { UserInfo } from "../../../components/userInfo/UserInfo";
import { primaryColor } from "../../../theme/Style";
import { TScreenNames } from "../../../utils/lib/Consts";
import { _profileService } from "./Profile.Services";
import { profileStyles } from "./Profile.Styles";
import { Settings } from "./settings/Settings";
import ProfilePostsSkeletonLoader from "./skeletons/ProfilePosts.Skeleton";

type TRouteParams = {
  userId: string;
  addMenuButton: boolean;
  navigatingFrom: TScreenNames;
  hideFollowButton: boolean;
};

export const Profile = ({ route, navigation }) => {
  const {
    userId,
    addMenuButton = true,
    navigatingFrom = "Profile",
    hideFollowButton = false,
  } = (route.params as TRouteParams) || {};
  const {
    userProfileDetails: {
      followersCount,
      followingsCount,
      fullName,
      postsCount,
      userImageUrl,
      userName,
      description,
    },
    posts,
    postsVM,
    isBottomSheetVisible,
    setBottomSheetVisible,
    toggleBottomSheet,
    toggleOptionsBottomSheet,
    isLoading,
    isCurrentUserFollowing,
    isProfileFromCurrentUser,
    followHandler,
    handleProfileFeedNavigation,
    i18n,
    viewTabOption,
    setViewTabOption,
    profileActivityOption,
    setProfileActivityOption,
    accountOptionsRef,
    optionsBottomSheetRef,
    handleOptionPress,
    reportBottomSheetRef,
    handleActivityOptionPress
  } = _profileService({ userId });

  function drawList() {
    if (isLoading) {
      return Array(9)
        .fill(null)
        .map((_, index) => <ProfilePostsSkeletonLoader key={index} />);
    }

    return posts.map((post, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleProfileFeedNavigation(post.id, navigatingFrom)}
        style={{
          width: "33%",
          height: 100,
          padding: 1,
        }}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
          }}
          source={{
            uri: post.data.imageUris[0],
          }}
        />
      </TouchableOpacity>
    ));
  }

  const menuButton = useCallback(
    (callback) => (
      <Button
        onPress={callback}
        styles={profileStyles.menuButton}
        iconLibrary="MaterialCommunityIcons"
        iconName="menu"
        iconSize={24}
        iconColor={primaryColor}
      />
    ),
    []
  );

  useEffect(() => {
    const callback =
      addMenuButton && isProfileFromCurrentUser
        ? toggleBottomSheet
        : toggleOptionsBottomSheet;

    navigation.setOptions({
      headerRight: () => menuButton(callback),
    });
  }, [isProfileFromCurrentUser]);

  return (
    <>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={profileStyles.data}>
          <UserInfo
            profilePictureUri={userImageUrl}
            userName={userName}
            caption={description}
            fullName={fullName}
            profilePictureStyle={profileStyles.profilePicture}
            userNameStyle={profileStyles.userName}
            containerStyle={profileStyles.userInfoContainer}
            textContainerStyle={profileStyles.userInfoTextContainer}
          />

          {(hideFollowButton || !isProfileFromCurrentUser) && (
            <>
              {userId && !isLoading ? (
                <View>
                  <Button
                    text={
                      isCurrentUserFollowing
                        ? `${i18n.t("profileFollowingText")}`
                        : `${i18n.t("profileFollowText")}`
                    }
                    styles={profileStyles.profileBtn}
                    onPress={followHandler}
                    textStyle={profileStyles.profileBtnText}
                  />
                </View>
              ) : (
                <>
                  {userId && isLoading && (
                    <ActivityIndicator size="large" color={primaryColor} />
                  )}
                </>
              )}
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            borderColor: "#6D6D6D",
            borderWidth: 0.2,
            justifyContent: "center",
          }}
        >
          <Tabs
            tabsOptions={[
              i18n.t("profileSwitchLeftLabelText"),
              i18n.t("profileSwitchRightLabelText"),
            ]}
            currentTab={viewTabOption}
            setCurrentTab={setViewTabOption}
            containerStyle={profileStyles.viewTabsContainer}
            tabStyle={profileStyles.viewTabs}
            textStyle={profileStyles.viewTabsText}
            activeTabStyle={profileStyles.viewTabsActive}
            activeTextStyle={profileStyles.viewTabsTextActive}
          />
          <Tabs
            tabsOptions={[
              { number: `${postsCount}`, label: i18n.t("profilePostsText") },
              {
                number: `${followingsCount}`,
                label: i18n.t("profileFollowingText"),
              },
              {
                number: `${followersCount}`,
                label: i18n.t("profileFollowersText"),
              },
            ]}
            currentTab={profileActivityOption}
            setCurrentTab={(currentTab) => handleActivityOptionPress(currentTab, navigatingFrom)}
            containerStyle={profileStyles.profileActivityTabsContainer}
            textStyle={profileStyles.profileActiviyTabsText}
            numberStyle={profileStyles.profileActivityTabsNumber}
            noActiveStyle={true}
            addDivider
          />
        </View>

        {viewTabOption === i18n.t("profileSwitchLeftLabelText") ? (
          <ScrollView>
            <View
              style={{
                padding: 5,
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              {posts.length > 0 ? (
                drawList()
              ) : isLoading ? (
                Array(9)
                  .fill(null)
                  .map((_, index) => <ProfilePostsSkeletonLoader key={index} />)
              ) : (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <MaterialCommunityIcons
                    name="image-off"
                    size={100}
                    color="#6D6D6D"
                  />
                  {isProfileFromCurrentUser ? (
                    <Text>{i18n.t("profileNoPostsText")}</Text>
                  ) : (
                    <Text>{i18n.t("profileNoPostsYetText")}</Text>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              height: 600,
            }}
          >
            <Map posts={postsVM} navigationFrom={navigatingFrom} />
          </View>
        )}
      </ScrollView>
      {/* SETTINGS */}
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
      >
        <Settings />
      </BottomSheet>
      
      <ModalBottomSheet bottomSheetModalRef={optionsBottomSheetRef}>
        <OptionsList
          options={accountOptionsRef.current}
          onOptionPress={handleOptionPress}
        />
      </ModalBottomSheet>

      {userId && !isProfileFromCurrentUser && (
        <ModalBottomSheet bottomSheetModalRef={reportBottomSheetRef}>
          <Report id={userId} isAccountReport />
        </ModalBottomSheet>
      )}
    </>
  );
};
