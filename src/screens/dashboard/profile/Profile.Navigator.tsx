import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Map } from '../../../components/map/Map';
import { PostCard } from '../../../components/postCard/PostCard';
import { FollowsList } from '../../../components/usersList/FollowsList';
import { primaryColor, whiteColor } from '../../../theme/Style';
import { useI18n } from '../../../utils/contexts/i18nContext';
import useScreenTimeTracker from '../../../utils/hooks/UseScreenTimeTracker';
import { ScreenNamesEnum } from '../../../utils/lib/Consts';
import { Feed } from '../feed/Feed';
import { Profile } from '../profile/Profile';
import { EditPost } from './editPost/EditPost';
import { ProfileDetails } from './profileDetails/ProfileDetails';
import { UserPreferences } from './userPreferences/UserPreferences';

const Stack = createNativeStackNavigator();

export const ProfileNavigator = () => {
  const { i18n } = useI18n();
  useScreenTimeTracker(ScreenNamesEnum.PROFILE);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: whiteColor,
        },
        headerTintColor: primaryColor,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen 
        name="Profile.Profile" 
        component={Profile} 
        options={{
          title: i18n.t("profileNavigatorProfileText"),
        }}
      />
      <Stack.Screen 
        name="Profile.NotCurrentUserProfile" 
        component={Profile} 
        options={{
          title: null,
        }}
      />
      <Stack.Screen 
        name="Profile.Feed" 
        component={Feed} 
        options={{
          title: i18n.t("profileNavigatorFeedText"),
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen 
        name="Profile.Post_Edit" 
        component={EditPost} 
        options={{
          title: i18n.t("profileNavigatorPostEditText"),
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen 
        name="Profile.Preferences" 
        component={UserPreferences} 
        options={{
          title: i18n.t("profileNavigatorUserPreferencesText"),
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen 
        name="Profile.Details" 
        component={ProfileDetails} 
        options={{
          title: i18n.t("profileNavigatorUserDetailsText"),
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen 
        name="Profile.Map" 
        component={Map} 
        options={{
          title: i18n.t("profileSwitchRightLabelText"),
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen 
        name="Profile.Post" 
        component={PostCard} 
        options={{
          title: i18n.t("profileNavigatorPostText"),
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen 
        name="Profile.Follows" 
        component={FollowsList} 
        options={{
          title: null,
          headerTintColor: primaryColor,
        }}
      />
    </Stack.Navigator>
  );
};