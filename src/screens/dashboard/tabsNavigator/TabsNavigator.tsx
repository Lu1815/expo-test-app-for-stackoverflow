import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TypedNavigator } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { primaryColor, whiteColor } from "../../../theme/Style";
import { useI18n } from "../../../utils/contexts/i18nContext";
import { AddNavigator } from "../add/Add.Navigator";
import { BookmarkNavigator } from "../bookmark/Bookmark.Navigator";
import { FeedNavigator } from "../feed/Feed.Navigator";
import { ProfileNavigator } from "../profile/Profile.Navigator";
import { SearchNavigator } from "../search/Search.Navigator";
import { _tabsNavigatorService } from "./TabsNavigator.Services";

export const TabsNavigator = () => {
  const {} = _tabsNavigatorService();
  const { i18n } = useI18n();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const Tab: TypedNavigator<any, any, any, any, any> =
    createBottomTabNavigator();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark"/>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: whiteColor,
          },
          headerTintColor: primaryColor,
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
          tabBarActiveTintColor: primaryColor,
          tabBarHideOnKeyboard: isKeyboardVisible,
        }}
      >
        <Tab.Screen
          name="Home"
          component={FeedNavigator}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-sharp" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchNavigator}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
            headerStyle: {
              headerShown: true,
            },
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddNavigator}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="add-circle-sharp"
                size={size + 10}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Bookmarks"
          component={BookmarkNavigator}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />

        {/* <Tab.Screen name="Profile" component={Profile} /> */}
      </Tab.Navigator>
    </>
  );
};
