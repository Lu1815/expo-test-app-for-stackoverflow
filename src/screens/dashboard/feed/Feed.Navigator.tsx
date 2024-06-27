import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Map } from "../../../components/map/Map";
import { PostCard } from "../../../components/postCard/PostCard";
import { FollowsList } from "../../../components/usersList/FollowsList";
import { primaryColor } from "../../../theme/Style";
import { useI18n } from "../../../utils/contexts/i18nContext";
import useScreenTimeTracker from "../../../utils/hooks/UseScreenTimeTracker";
import { ScreenNamesEnum, ScreenRoutes } from "../../../utils/lib/Consts";
import { Profile } from "../profile/Profile";
import { Feed } from "./Feed";

const Stack = createNativeStackNavigator();

export const FeedNavigator = () => {
  const { i18n } = useI18n();
  useScreenTimeTracker(ScreenNamesEnum.FEED);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen 
        name="Feed.Profile" 
        component={Profile} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Feed.Profile.Profile" 
        component={Profile} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Feed.Map" 
        component={Map} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Feed.Post" 
        component={PostCard} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name={ScreenRoutes.FEED_PROFILE_FEED} 
        component={Feed} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name={ScreenRoutes.FEED_PROFILE_FOLLOWS} 
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
