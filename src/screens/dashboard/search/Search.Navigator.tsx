import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Map } from "../../../components/map/Map";
import { PostCard } from "../../../components/postCard/PostCard";
import { FollowsList } from "../../../components/usersList/FollowsList";
import { primaryColor } from "../../../theme/Style";
import { useNavigationGH } from "../../../utils/hooks/UseNavigation";
import useScreenTimeTracker from "../../../utils/hooks/UseScreenTimeTracker";
import { ScreenNamesEnum, ScreenRoutes } from "../../../utils/lib/Consts";
import { Feed } from "../feed/Feed";
import { Profile } from "../profile/Profile";
import { Search } from "./Search";

const Stack = createNativeStackNavigator();

export const SearchNavigator = () => {
  const { navigation } = useNavigationGH();
  useScreenTimeTracker(ScreenNamesEnum.SEARCH);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search.Search" component={Search} />
      <Stack.Screen 
        name="Search.Map" 
        component={Map} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Search.Profile" 
        component={Profile} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Search.Profile.Profile" 
        component={Profile} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Search.Profile.Feed" 
        component={Feed} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name="Search.Post" 
        component={PostCard} 
        options={{ 
          title: null,
          headerShown: true,
          headerTintColor: primaryColor
        }}
      />
      <Stack.Screen 
        name={ScreenRoutes.SEARCH_PROFILE_FOLLOWS} 
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
