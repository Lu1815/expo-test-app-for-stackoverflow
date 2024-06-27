import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { useState } from 'react';
import { useAuth } from "../../../utils/contexts/AuthContext";
import { TUserAnalytics } from '../../../utils/entities/UserAnalytics';
import { IBookmarksCollections, TUserDetails } from '../../../utils/entities/UserDetails';
import { useNavigationGH } from '../../../utils/hooks/UseNavigation';
import { ComponentNames, FirestoreCollections, SignUpMessages } from "../../../utils/lib/Consts";
import { errorToast, successToast } from "../../../utils/lib/Toasts";
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';
import { requestUserPermission } from '../../../utils/lib/fcm/RequestUserPermission';

const DEFAULT_IMAGE = process.env.EXPO_PUBLIC_DEFAULT_BOOKMARK_IMAGE;

export const _phoneService = () => {
    const [loading, setLoading] = useState(false);
    const { currentUser, setVerificationIdForMultifactorAuth, setMultifactorUser } = useAuth();
    const { navigation } = useNavigationGH();

    const handlePhoneSubmit = async (values: { phoneNumber: string, otpStatus: boolean }) => {
        setLoading(true);
        try {
            let deviceToken: string[] = [];
            const multiFactorUser = await auth().multiFactor(auth().currentUser);
            const session = await multiFactorUser.getSession();
            const phoneOptions: FirebaseAuthTypes.PhoneMultiFactorEnrollInfoOptions = {
                phoneNumber: values.phoneNumber,
                session,
            };

            const verificationId = await auth().verifyPhoneNumberForMultiFactor(phoneOptions);
            setVerificationIdForMultifactorAuth(verificationId);
            setMultifactorUser(multiFactorUser);

            console.log(`Phone number verification sent to ${values.phoneNumber}`);
            successToast("", SignUpMessages.OTP_CODE_SENT);

            // IF THE USER ALLOWS NOTIFICATIONS, GET THE DEVICE TOKEN
            if (requestUserPermission()) {
                if (messaging().hasPermission()) {
                    console.log("User has granted permission for notifications");
                    messaging() // Get the device token
                        .getToken()
                        .then(
                            token => {
                                console.log(`Push notification token: ${token}`)
                                deviceToken.push(token);
                            },
                        );
                } else {
                    console.log("User has not granted permission for notifications");
                }
            }

            const searchKeywords = [
                currentUser.email.split('@')[0],
                currentUser.email.split('@')[0].toLowerCase(),
                currentUser.email.split('@')[0].toUpperCase(),
                currentUser.email,
            ]

            // Save or update user details in Firestore.
            const newUserDetails: TUserDetails = {
                description: "",
                followersCount: 0,
                followingsCount: 0,
                isEmailVerified: true,
                isOtpLoginEnabled: values.otpStatus,
                isPhoneNumberVerified: false,
                phoneNumber: values.phoneNumber,
                picture: "",
                postCount: 0,
                userName: currentUser.email.split('@')[0],
                userEmail: currentUser.email,
                searchKeywords: searchKeywords,
                devicesTokens: deviceToken,
                isDisabled: false,
                createdAt: new Date().toISOString(),
                createdAtTimestamp: firestore.Timestamp.now().toMillis(),
            }

            await firestore()
                .collection(FirestoreCollections.USER_DETAILS)
                .doc(currentUser.uid)
                .set(newUserDetails);

            // Initialize default bookmark collection "see later"
            const defaultBookmarkCollection: IBookmarksCollections = {
                id: 'default',
                name: 'See later',
                description: 'Default collection',
                optionImage: DEFAULT_IMAGE,
            };

            await firestore()
                .collection(FirestoreCollections.USER_DETAILS)
                .doc(currentUser.uid)
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
                userId: currentUser.uid,
            }

            await firestore()
                .collection(FirestoreCollections.USER_ANALYTICS)
                .doc(currentUser.uid)
                .set(userAnalytics);

            navigation.navigate(ComponentNames.OTP);
        } catch (err) {
            errorLogger(
                err,
                `Error during phone authentication > _phoneService.handlePhoneSubmit function.`
            )
            errorToast(SignUpMessages.OTP_CODE_NOT_SENT, err.message.split("]")[1], { fontSize: 12 }, { fontSize: 10 });
        } finally {
            setLoading(false);
        }
    };

    async function handleReturnToLogin() {
        await auth().signOut();
    }

    return { handlePhoneSubmit, loading, handleReturnToLogin };
};
