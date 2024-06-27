import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Map } from "../../../components/map/Map";
import { PostCard } from "../../../components/postCard/PostCard";
import { FollowsList } from "../../../components/usersList/FollowsList";
import { primaryColor } from "../../../theme/Style";
import { useI18n } from "../../../utils/contexts/i18nContext";
import useScreenTimeTracker from "../../../utils/hooks/UseScreenTimeTracker";
import { ScreenNamesEnum, ScreenRoutes } from "../../../utils/lib/Consts";
import { Feed } from "../feed/Feed";
import { Profile } from "../profile/Profile";
import { Bookmark } from "./Bookmark";
import { AddBookmarkCollection } from "./addBookmarkCollection/AddBookmarkCollection";
import { CreateBookmarkCollection } from "./createBookmarkCollection/CreateBookmarkCollection";

const Stack = createNativeStackNavigator();

export const BookmarkNavigator = () => {
  const { i18n } = useI18n();
  useScreenTimeTracker(ScreenNamesEnum.BOOKMARKS);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: primaryColor,
      }}
    >
      <Stack.Screen
        name="Bookmark"
        component={Bookmark}
        options={{
          title: i18n.t("bookmarkTitleText"),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Bookmark.Profile"
        component={Profile}
        options={{
          title: i18n.t("bookmarkProfileText"),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Bookmark.Profile.Feed"
        component={Feed}
        options={{
          title: i18n.t("bookmarkProfileFeedText"),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Bookmark.Feed"
        component={Feed}
        options={{
          title: i18n.t("bookmarkFeedTitleText"),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Bookmark.Post"
        component={PostCard}
        options={{
          title: i18n.t("bookmarkPostTitleText"),
          headerShown: true,
        }}
      />
      <Stack.Screen name="Bookmark.Map" component={Map} />

      <Stack.Screen
        name="Bookmark.AddCollection"
        component={AddBookmarkCollection}
        options={{
          title: i18n.t("bookmarkSelectPostsText"),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Bookmark.CreateCollection"
        component={CreateBookmarkCollection}
        options={{
          title: i18n.t("bookmarkAddCollectionText"),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={ScreenRoutes.BOOKMARK_PROFILE_FOLLOWS}
        component={FollowsList}
        options={{
          title: null,
          headerShown: true,
          headerTintColor: primaryColor,
        }}
      />
    </Stack.Navigator>
  );
};
