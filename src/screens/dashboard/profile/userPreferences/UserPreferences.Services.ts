import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useState } from "react";
import { useAuth } from "../../../../utils/contexts/AuthContext";
import { useI18n } from "../../../../utils/contexts/i18nContext";
import { TUserPreferences } from "../../../../utils/entities/UserPreferences";
import { FirestoreCollections } from "../../../../utils/lib/Consts";
import { errorToast } from "../../../../utils/lib/Toasts";
import { errorLogger } from '../../../../utils/lib/errors/ErrorLogger';

export const _userpreferencesService = () => {
    const { currentUser } = useAuth();
    const { i18n, locale, changeLanguage } = useI18n();

    const [loading, setLoading]                             = useState(false)
    const [isDeleteModalVisible, setDeleteModalVisible]     = useState(false);

    async function handleDeleteAccountConfirm() {
        try {
            await auth().currentUser.delete();
        } catch (error) {
            errorLogger(
                error,
                "Error during deleting account > _userpreferencesService.handleDeleteAccountConfirm function."
            )
            errorToast(i18n.t("userPreferencesErrorDeletingAccountText"));
        }
    }

    const loadUserPreferences = async (userId) => {
        try {
            const userPreferencesRef = firestore().collection(FirestoreCollections.USER_PREFERENCES);
            const docRef = userPreferencesRef.doc(userId);
            const doc = await docRef.get();

            if (!doc.exists) {
                return null;
            }

            const userPreferences = doc.data() as TUserPreferences;

            changeLanguage(userPreferences.locale);
        } catch (error) {
            errorLogger(
                error,
                "Error during loading user preferences > _userpreferencesService.loadUserPreferences function."
            )
        }
    }

    async function saveUserPreferences(languageCode) {
        const currentLocale = locale;
        setLoading(true)
        changeLanguage(languageCode);

        try {
            const userPreferencesRef = firestore().collection(FirestoreCollections.USER_PREFERENCES);
            const docRef = userPreferencesRef.doc(currentUser.uid);

            const newUserPreferences: TUserPreferences = {
                locale: languageCode,
                theme: 'light',
                notifications: {
                    comments: true,
                    likes: true,
                    follows: true,
                },
                privacy: {
                    publicProfile: true,
                    showEmail: true,
                    showPhone: true,
                }
            }

            const doc = await docRef.get();

            if (doc.exists) {
                await docRef.update(newUserPreferences);
            } else {
                await docRef.set(newUserPreferences);
            }
        } catch (error) {
            errorLogger(
                error,
                "Error during saving user preferences > _userpreferencesService.saveUserPreferences function."
            )

            errorToast(i18n.t("userPreferencesErrorSavingPreferencesText"));
            changeLanguage(currentLocale);
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        loadUserPreferences,
        saveUserPreferences,
        i18n,
        locale,
        isDeleteModalVisible,
        setDeleteModalVisible,
        handleDeleteAccountConfirm
    }
}
