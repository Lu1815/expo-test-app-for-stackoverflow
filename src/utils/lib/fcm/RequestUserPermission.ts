import messaging from '@react-native-firebase/messaging';

/**
 * Request user permission for Firebase Cloud Messaging (FCM) notifications
 * 
 * @returns {Promise<void>}
 */
export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log("Authorization status:", authStatus);
    }
};