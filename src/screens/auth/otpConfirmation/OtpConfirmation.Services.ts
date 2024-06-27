import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useState } from "react";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { useNavigationGH } from "../../../utils/hooks/UseNavigation";
import { ComponentNames, FirestoreCollections } from "../../../utils/lib/Consts";
import { errorToast } from "../../../utils/lib/Toasts";
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';

export const _otpService = () => {
    const [loading, setLoading] = useState(false);
    const { currentUser, setCurrentUser, verificationIdForMultifactorAuth, multifactorUser, multifactorResolver } = useAuth();
    const { navigation } = useNavigationGH();

    const handleCodeConfirmation = async ({ otpCode }) => {
        setLoading(true);

        try {
            const cred = auth.PhoneAuthProvider.credential(verificationIdForMultifactorAuth, otpCode);
            const multiFactorAssertion = auth.PhoneMultiFactorGenerator.assertion(cred);

            if (multifactorUser) {
                await multifactorUser.enroll(multiFactorAssertion);
                await firestore().collection(FirestoreCollections.USER_DETAILS).doc(currentUser.uid).update({
                    isPhoneNumberVerified: true,
                });
                console.log(`Phone number verified for user: ${auth().currentUser?.email}`)
                setCurrentUser(auth().currentUser);
                // infoToast("Please login again.", "We already registered your data");
                // await handleReturnToLogin();
            } else {
                await multifactorResolver.resolveSignIn(multiFactorAssertion)
            }
        } catch (err) {
            errorLogger(
                err,
                "Error during OTP confirmation > _otpService.handleCodeConfirmation function.",
                currentUser
            )
            console.log(`Error during OTP confirmation: ${err}`)

            errorToast(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleReturnToLogin() {
        if(currentUser){
            await auth().signOut();
            return
        }

        navigation.navigate(ComponentNames.LOGIN);
    }

    return { handleCodeConfirmation, loading, handleReturnToLogin };
}
