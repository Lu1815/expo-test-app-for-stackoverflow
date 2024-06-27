import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { TUserDetails } from '../../entities/UserDetails';
/** 
 * Logs the error in Firebase Crashlytics and also in console if **errorMessage** is provided.
 * 
 * @param {Error} error - The error object.
 * @param {string} errorMessage - The error message to be logged.
 * @param {FirebaseAuthTypes.User} userData - The user data.
 * @param {TUserDetails} userDetails - The user details.
 */
export const errorLogger = (error: Error, errorMessage?: string, userData?: FirebaseAuthTypes.User, userDetails?: TUserDetails) => {
    if(userData) {
        crashlytics().setUserId(userData.uid);
        crashlytics().setAttributes({
            email: userData.email,
            username: userData.displayName,
        });
    }

    if(userDetails) {
        crashlytics().setAttributes({
            userName: userDetails.userName,
            email: userDetails.userEmail,
            phoneNumber: userDetails.phoneNumber,
        });
    }

    if(errorMessage) {
        crashlytics().log(errorMessage);
        console.log(errorMessage);
        console.log(error.stack || "");
    }

    crashlytics().recordError(error);
    crashlytics().log(error.message || "");
    crashlytics().log(error.stack || "");
};