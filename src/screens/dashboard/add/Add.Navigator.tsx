import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { primaryColor } from "../../../theme/Style";
import { useI18n } from "../../../utils/contexts/i18nContext";
import useScreenTimeTracker from "../../../utils/hooks/UseScreenTimeTracker";
import { ScreenNamesEnum, ScreenRoutes } from "../../../utils/lib/Consts";
import { Add } from "./Add";
import { LocationSelector } from "./locationSelector/LocationSelector";

const Stack = createNativeStackNavigator();

export const AddNavigator = () => {
  const { i18n } = useI18n();
  useScreenTimeTracker(ScreenNamesEnum.FEED);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenRoutes.ADD_FORM}
        component={Add}
        options={{
          title: `${i18n.t("addPostTitleText")}`,
          headerShown: true,
          headerTintColor: primaryColor,
        }}
      />
      <Stack.Screen
        name={ScreenRoutes.ADD_FORM_LOCATION}
        component={LocationSelector}
        options={{
          title: i18n.t("locationSelectorTitle"),
          headerShown: true,
          headerTintColor: primaryColor,
        }}
      />
    </Stack.Navigator>
  );
};
