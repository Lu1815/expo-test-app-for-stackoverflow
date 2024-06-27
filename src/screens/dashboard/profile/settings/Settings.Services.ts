import auth from '@react-native-firebase/auth';
import { useState } from "react";
import { useI18n } from '../../../../utils/contexts/i18nContext';
import { useNavigationGH } from "../../../../utils/hooks/UseNavigation";
import { errorToast } from "../../../../utils/lib/Toasts";
import { errorLogger } from '../../../../utils/lib/errors/ErrorLogger';

export const _settingsService = () => {
    const { i18n } = useI18n();

    const [loading, setLoading] = useState(false);
    const [isProfileDetailsModalVisible, setProfileDetailsModalVisible] = useState(false);
    const { navigation } = useNavigationGH();

    const handleLogOut = async () => {
        setLoading(true);
        try {
            console.log("Signing out...");
            await auth().signOut();
        } catch (err) {
            errorLogger(
                err,
                "Error during sign out > _settingsService.handleLogOut function."
            )

            errorToast('There was an error signing out!');
        } finally {
            setLoading(false);
        }
    }

    return { handleLogOut, loading, isProfileDetailsModalVisible, setProfileDetailsModalVisible, navigation, i18n };
}
