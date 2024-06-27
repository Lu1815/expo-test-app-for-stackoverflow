import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useAuth } from '../../utils/contexts/AuthContext';
import { TUserDetails } from '../../utils/entities';
import { TUserAnalytics } from '../../utils/entities/UserAnalytics';
import { IBookmarksCollections } from '../../utils/entities/UserDetails';
import { FirestoreCollections } from "../../utils/lib/Consts";
import { infoToast } from "../../utils/lib/Toasts";
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';

const DEFAULT_IMAGE = process.env.EXPO_PUBLIC_DEFAULT_BOOKMARK_IMAGE;

export const _googleAuthService = () => {
  const { setCurrentUser } = useAuth();

  async function googleAuthentication() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Assuming `userInfo.idToken` is still available and valid after the signIn.
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

      // signInWithCredential is replaced by signInWithCredential method on auth() object.
      const userCredential = await auth().signInWithCredential(googleCredential);

      const userDocRef = firestore().collection(FirestoreCollections.USER_DETAILS).doc(userCredential.user.uid);
      const docSnap = await userDocRef.get();

      const searchKeywords = [
        userInfo.user.email.split('@')[0],
        userInfo.user.familyName,
        userInfo.user.givenName,
        userInfo.user.email,
        userInfo.user.name,
        userInfo.user.email.split('@')[0].toLowerCase(),
        userInfo.user.familyName.toLowerCase(),
        userInfo.user.givenName.toLowerCase(),
        userInfo.user.email.toLowerCase(),
        userInfo.user.name.toLowerCase(),
        userInfo.user.email.split('@')[0].toUpperCase(),
        userInfo.user.familyName.toUpperCase(),
        userInfo.user.givenName.toUpperCase(),
        userInfo.user.email.toUpperCase(),
        userInfo.user.name.toUpperCase(),
      ];

      const userCreatedWithGoogle: TUserDetails = {
        createdAt: new Date().toISOString(),
        createdAtTimestamp: firestore.Timestamp.now().toMillis(),
        createdWithGoogle: true,
        description: "",
        followersCount: 0,
        followingsCount: 0,
        isEmailVerified: true,
        isOtpLoginEnabled: false,
        isPhoneNumberVerified: true,
        phoneNumber: "",
        picture: userInfo.user.photo || "",
        postCount: 0,
        searchKeywords,
        userEmail: userInfo.user.email,
        userName: userInfo.user.email.split('@')[0],
      }

      if (!docSnap.exists) {
        await userDocRef.set(userCreatedWithGoogle);
        await saveUserData(userCredential.user.uid);
      }
      
      // THE APP SETS THE CURRENT USER HERE TO FORCE THE AuthStateListener TO RUN AGAIN
      setCurrentUser(userCredential.user);
    } catch (error) {
      // Handle errors here
      const errorMessages: { [key: string]: string } = {
        [statusCodes.SIGN_IN_CANCELLED]: 'Login flow cancelled',
        [statusCodes.IN_PROGRESS]: 'Login flow in progress',
        [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Play services not available or outdated',
        default: 'An error occurred during Google Sign-In',
      }

      infoToast(errorMessages[error.code] || errorMessages.default);

      errorLogger(
        error,
        "Error during Google Sign-In > _googleAuthService.googleAuthentication function."
      )
    }
  };

  async function saveUserData(userId: string) {
    try {
      // Initialize default bookmark collection "see later"
      const defaultBookmarkCollection: IBookmarksCollections = {
        id: 'default',
        name: 'See later',
        description: 'Default collection',
        optionImage: DEFAULT_IMAGE,
      };

      await firestore()
        .collection(FirestoreCollections.USER_DETAILS)
        .doc(userId)
        .collection(FirestoreCollections.BOOKMARKS)
        .doc('default')
        .set(defaultBookmarkCollection);

      // SAVE USER ANALYTICS DATA
      const userAnalytics: TUserAnalytics = {
        accountCreatedAt: new Date().toISOString(),
        accountCreatedAtTimestamp: firestore.Timestamp.now().toMillis(),
        accountDuration: "0 days",
        accountDurationInDays: 0,
        accountDurationInMonths: 0,
        accountDurationInYears: 0,
        userId: userId,
      }

      await firestore()
        .collection(FirestoreCollections.USER_ANALYTICS)
        .doc(userId)
        .set(userAnalytics);
    } catch (error) {
      errorLogger(
        error,
        "Error during Google Sign-In > _googleAuthService.saveUserData function."
      )
    }
  }

  return { googleAuthentication };
};
