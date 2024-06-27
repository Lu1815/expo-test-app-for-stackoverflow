import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { LoginErrorMessages, SignUpMessages } from '../../../utils/lib/Consts';
import { infoToast } from '../../../utils/lib/Toasts';
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';

export const _signUpService = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            await auth().createUserWithEmailAndPassword(values.email, values.password);

            // Optionally sign out the user right away (if needed)
            // await auth().signOut();

            // Reset form values
            values.email = '';
            values.password = '';

            // Navigate to the PHONE_AUTH component
            // navigation.navigate(ComponentNames.PHONE_AUTH);
        } catch (error) {
            let errorMessage = '';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    infoToast(SignUpMessages.EMAIL_ALREADY_IN_USE);
                    break;
                case 'auth/weak-password':
                    infoToast(SignUpMessages.WEAK_PASSWORD);
                    break;
                case 'auth/invalid-email':
                    errorMessage = LoginErrorMessages.INVALID_EMAIL;
                    break;
                default:
                    errorMessage = "An unknown error occurred.";
                    break;
            }

            errorLogger(
                error,
                `Error during signup > _signUpService.handleSubmit function. Error code: ${error.code}`
            )
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { handleSubmit, loading, error };
};
