import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { GHCamera } from "../../components/GHCamera";
import { Login } from "../../screens/auth/login/Login";
import { OtpConfirmation } from "../../screens/auth/otpConfirmation/OtpConfirmation";
import { Phone } from "../../screens/auth/phone/Phone";
import { Signup } from "../../screens/auth/signup/Signup";
import { TabsNavigator } from "../../screens/dashboard/tabsNavigator/TabsNavigator";
import { TUserDetails } from "../entities";
import { useNavigationGH } from "../hooks/UseNavigation";
import { ComponentNames, LoginCodes } from "../lib/Consts";
import { errorToast } from "../lib/Toasts";
import { _authContextService } from "./AuthServices";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

async function onSignIn(user: FirebaseAuthTypes.User) {
  crashlytics().log("User signed in.");
  await Promise.all([
    crashlytics().setUserId(user.uid),
    crashlytics().setAttributes({
      email: user.email,
      username: user.displayName,
    }),
  ]);
}

const AuthStateListener = () => {
  const [authVerificationUser, setAuthVerificationUser] =
    useState<TUserDetails | null>(null);
  const { navigation } = useNavigationGH();
  const {
    handleEmailNotVerified,
    validateUser,
    loadUserPreferences,
    currentUser: user,
    loading,
    getUserVerificationDetails,
  } = _authContextService();

  useEffect(() => {
    if (loading) return;

    if (user) {
      (async () => {
        try {
          const userDetails = await getUserVerificationDetails(user);

          setAuthVerificationUser(userDetails);

          if (typeof user.uid === "string") {
            await onSignIn(user);
          }

          await loadUserPreferences(user.uid);
          const validationResult = await validateUser(user);

          /* 
            IF THE USER HAS NOT VERIFIED HIS EMAIL THE APP WILL SEND A VERIFICATION EMAIL
            AND NAVIGATE TO THE LOGIN SCREEN
          */
          if (validationResult === LoginCodes.EMAIL_NOT_VERIFIED) {
            await handleEmailNotVerified(user);
            return;
          }

          /**
            IF THERE ARE NO DOCUMENTS IN THE userDetails COLLECTION FOR THE AUTHENTICATED USER
            THAT MEANS THE USER HAS NOT COMPLETED THE SIGN UP PROCESS, SO THE APP WILL NAVIGATE
            TO THE PHONE_AUTH SCREEN WHERE THE APP SAVES THE USER DETAILS IN THE userDetails COLLECTION
            AND SAVES THE MULTIFACTOR AUTHENTICATION (MFA) METHOD 
          **/
          if (validationResult === LoginCodes.USER_DETAILS_NOT_FOUND) {
            navigation.navigate(ComponentNames.PHONE_AUTH);
            return;
          }

          // navigation.navigate(ComponentNames.TABS_NAVIGATOR);
        } catch (error) {
          setAuthVerificationUser(null);
          console.log(`ERROR: ${JSON.stringify(error.message, null, 2)}`);
          errorToast(error.message);
          await auth().signOut();
        }
      })();
    } else {
      setAuthVerificationUser(null);

      if (authVerificationUser === null) {
        navigation.navigate(ComponentNames.LOGIN);
      }
    }
  }, [user, navigation]);

  return <AppNavigator currentUser={authVerificationUser} />;
};

export default AuthStateListener;

const AuthenticatedStack = () => (
  <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabsNavigator" component={TabsNavigator} />
      <Stack.Screen name="AppCamera" component={GHCamera} />
    </Stack.Navigator>
  </SafeAreaView>
);

const UnauthenticatedStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="PhoneAuth" component={Phone} />
    <Stack.Screen name="OtpConfirmation" component={OtpConfirmation} />
  </Stack.Navigator>
);

const AppNavigator = ({ currentUser }) => {
  console.log(`App > currentUser: ${currentUser}`);
  console.log(
    `App > currentUser?.isEmailVerified: ${currentUser?.isEmailVerified}`
  );
  console.log(
    `App > currentUser?.isPhoneNumberVerified: ${currentUser?.isPhoneNumberVerified}`
  );
  console.log(
    `App > currentUser?.createdWithGoogle: ${currentUser?.createdWithGoogle}`
  );

  return (currentUser &&
    currentUser?.isEmailVerified &&
    currentUser?.isPhoneNumberVerified) ||
    currentUser?.createdWithGoogle ? (
    <AuthenticatedStack />
  ) : (
    <UnauthenticatedStack />
  );
};
