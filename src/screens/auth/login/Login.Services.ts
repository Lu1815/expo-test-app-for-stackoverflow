import auth from '@react-native-firebase/auth';
import { useRef, useState } from 'react';
import { _authContextService } from '../../../utils/auth/AuthServices';
import { useAuth } from '../../../utils/contexts/AuthContext';
import { useNavigationGH } from '../../../utils/hooks/UseNavigation';
import { ComponentNames, FirebaseErrors, LoginErrorMessages, LoginInfoMessages } from '../../../utils/lib/Consts';
import { errorToast, infoToast } from '../../../utils/lib/Toasts';
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';

export const _loginService = () => {
    // #region STATES
    // EXTERNAL SERVICES
    const { setVerificationIdForMultifactorAuth } = useAuth();
    const { handleOtpLoginEnabledOrPhoneNumberNotVerified } = _authContextService();
    const { navigation } = useNavigationGH();

    // LOCAL STATES
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [failedLoginCount, setFailedLoginCount] = useState(0);
    const recaptchaRef = useRef(null);
    
    // #region FUNCTIONS

    // #region handleSubmit
    async function handleSubmit (values: { email: string; password: string }) {
        setLoading(true);
        try {
            console.log(`Login with credentials: ${values.email}, Password: ${values.password}`)

            await auth().signInWithEmailAndPassword(values.email, values.password);
            values.email = "";
            values.password = "";
            setFailedLoginCount(0);
        } catch (error) {
            console.info(`Error during login: ${error}`)

            if (error.code === 'auth/multi-factor-auth-required') {
                const otpResult = await handleOtpLoginEnabledOrPhoneNumberNotVerified(error);
                if (otpResult.isSuccess) {
                    setVerificationIdForMultifactorAuth(otpResult.value);
                    navigation.navigate(ComponentNames.OTP);
                    return; // Early return to avoid further processing
                }

                infoToast(otpResult.error, "Try again later!");
            } else {
                let errorMessage: string = getErrorMessageByCode(error.code);
    
                errorLogger(
                    error,
                    `Error during login > _loginService.handleSubmit function. Error code: ${error.code}`
                )
                setError(errorMessage);
                errorToast(errorMessage);
                setFailedLoginCount(failedLoginCount + 1);
            }
        } finally {
            setLoading(false);
        }
    };

    // #region handlePasswordReset
    async function handlePasswordReset (email: string) {
        try {
            await auth().sendPasswordResetEmail(email);
            infoToast(LoginInfoMessages.PASSWORD_RESET_SEND);
        } catch (error) {
            let errorMessage: string = getErrorMessageByCode(error.code);

            errorLogger(
                error,
                `Error during password reset > _loginService.handlePasswordReset function. Error code: ${error.code}`
            )
            errorToast(errorMessage);
        }
    };

    function getErrorMessageByCode(code: string): string {
        const errorMsgObject: { [key: string]: string } = {
            [FirebaseErrors.AUTH_INVALID_CREDENTIALS]: LoginErrorMessages.INVALID_CRENDENTIALS,
            [FirebaseErrors.AUTH_INVALID_EMAIL]: LoginErrorMessages.INVALID_EMAIL,
            [FirebaseErrors.AUTH_INVALID_PWD]: LoginErrorMessages.INVALID_PWD,
            [FirebaseErrors.AUTH_NETWORK_REQUEST_FAILED]: LoginErrorMessages.PASSWORD_RESET_NETWORK_REQUEST_FAILED,
            [FirebaseErrors.AUTH_USER_NOT_FOUND]: LoginErrorMessages.PASSWORD_RESET_INVALID_EMAIL,
        };

        return errorMsgObject[code] || "An unknown error occurred. Try again later.";
    }

    return {
        handleSubmit,
        handlePasswordReset,
        loading,
        error,
        failedLoginCount,
        recaptchaRef
    };
};
