import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { _userpreferencesService } from '../../screens/dashboard/profile/userPreferences/UserPreferences.Services';
import { useAuth } from '../contexts/AuthContext';
import { TUserDetails } from '../entities/UserDetails';
import { useNavigationGH } from "../hooks/UseNavigation";
import { ComponentNames, FirebaseErrors, FirestoreCollections, LoginCodes } from "../lib/Consts";
import { infoToast } from "../lib/Toasts";

export const _authContextService = () => {
    const { setMultifactorResolver, currentUser, loading } = useAuth();
    const { loadUserPreferences } = _userpreferencesService();
    const { navigation } = useNavigationGH();

    const checkUserEmailVerification = async () => {
        if (!auth().currentUser.emailVerified) {
            infoToast("Please verify your email before using the app!", "We just sent you a verification email");

            auth().currentUser.sendEmailVerification().catch((error) => {
                if (error.code === FirebaseErrors.TOO_MANY_REQUESTS) {
                    infoToast(
                        "Your email is not verified",
                        "There was a problem sending the email verification, please try again later"
                    );
                }
            });
            await auth().signOut();
            navigation.navigate(ComponentNames.LOGIN);
            return;
        }
    }

    async function getUserVerificationDetails(user: FirebaseAuthTypes.User): Promise<TUserDetails> {
        const docRef = firestore().doc(`${FirestoreCollections.USER_DETAILS}/${user.uid}`);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return null;
        }

        return docSnap.data() as TUserDetails;
    }

    async function validateUser(user: FirebaseAuthTypes.User): Promise<string | LoginCodes> {
        if (!user.emailVerified) {
            return LoginCodes.EMAIL_NOT_VERIFIED;
        }

        const docRef = firestore().doc(
            `${FirestoreCollections.USER_DETAILS}/${user.uid}`
        );
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return LoginCodes.USER_DETAILS_NOT_FOUND;
        }

        const userDetails = docSnap.data() as TUserDetails;

        if (userDetails.isOtpLoginEnabled) {
            return `${LoginCodes.OTP_LOGIN_ENABLED},${userDetails.phoneNumber}`;
        }

        if (!userDetails.isPhoneNumberVerified) {
            return LoginCodes.PHONE_NUMBER_NOT_VERIFIED;
        }

        return LoginCodes.VALID_LOGIN;
    }

    async function handleEmailNotVerified(user: FirebaseAuthTypes.User): Promise<void> {
        infoToast(
            `Verify your email: ${user.email}`,
            "Email verification message sent"
        );
        user.sendEmailVerification().catch((error) => {
            if (error.code === FirebaseErrors.TOO_MANY_REQUESTS) {
                infoToast(
                    "Your email is not verified",
                    "There was a problem sending the email verification, please try again later"
                );
            }
        });

        await auth().signOut();
    }

    /* 
        IF THE USER HAS NOT VERIFIED HIS PHONE NUMBER OR HAS ENABLED THE OTP LOGIN
        THE APP WILL SEND A VERIFICATION CODE TO THE USER'S PHONE NUMBER
    */
        async function handleOtpLoginEnabledOrPhoneNumberNotVerified(
            error: any
        ): Promise<OperationResult<string>> {
            const resolver: FirebaseAuthTypes.MultiFactorResolver = auth().getMultiFactorResolver(error);
        
            if (resolver.hints[0].factorId === auth.PhoneMultiFactorGenerator.FACTOR_ID) {
                const hint: FirebaseAuthTypes.MultiFactorInfo = resolver.hints[0];
                const sessionId: FirebaseAuthTypes.MultiFactorSession = resolver.session;
        
                try {
                    const verificationId = await auth().verifyPhoneNumberWithMultiFactorInfo(hint, sessionId);
                    setMultifactorResolver(resolver);

                    return { isSuccess: true, value: verificationId }; // Return success status and any necessary data
                } catch (error) {
                    console.error(`Error during phone authentication: ${error}`);
                    infoToast(
                        "There was an error sending the verification code",
                        "Please try again later"
                    );
                    return { isSuccess: false, error: "Error sending verification code" };
                }
            }
            return { isSuccess: false, error: "Factor ID not found" };
        }

    return {
        currentUser,
        loading,
        checkUserEmailVerification,
        validateUser,
        handleEmailNotVerified,
        handleOtpLoginEnabledOrPhoneNumberNotVerified,
        loadUserPreferences,
        getUserVerificationDetails
    };
}