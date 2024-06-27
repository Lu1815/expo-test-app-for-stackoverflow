import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import AuthStateListener from "./src/utils/auth/AuthStateListener";
import { AnalyticsProvider } from "./src/utils/contexts/AnalyticsContext";
import { AuthProvider } from "./src/utils/contexts/AuthContext";
import { I18nProvider } from "./src/utils/contexts/i18nContext";
import { toastsConfig } from "./src/utils/lib/Toasts";
import { getLinkingConfig } from "./src/utils/lib/deepLinkingRoutes";
import { SafeAreaProvider } from "react-native-safe-area-context";

const prefix = Linking.createURL("/");

const App = () => {
  const linking: LinkingOptions<ReactNavigation.RootParamList> = getLinkingConfig(prefix);

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <I18nProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <AuthProvider>
                <AnalyticsProvider>
                  <StatusBar style="dark" />
                  <AuthStateListener />
                  <Toast config={toastsConfig} />
                </AnalyticsProvider>
              </AuthProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </I18nProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
