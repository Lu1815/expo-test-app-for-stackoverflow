import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';

//
export const setupPushNotifications = async (navigation: NavigationProp<ParamListBase>) => {
    //* Example: Request user permission to send push notifications
    //* You can see how this is being implemented in the TabsNavigator.Services.ts file
    // if (requestUserPermission()) {
    //     messaging()
    //         .getToken()
    //         .then(
    //             token => console.log(`Push notification token: ${token}`),
    //         );
    // }

    // Set up the notification handler for the app
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    // Handle user clicking on a notification and open the screen
    const handleNotificationClick = async (response: Notifications.NotificationResponse) => {
        console.log("Notification clicked: ", response.notification.request.content)

        const screen = response?.notification?.request?.content?.data?.screen;

        console.log("Notification clicked > screen: ", screen);

        if (screen) {
            navigation.navigate(screen);
        }
    };

    // Listen for user clicking on a notification
    const notificationClickSubscription =
        Notifications.addNotificationResponseReceivedListener(
            handleNotificationClick
        );

    // Handle user opening the app from a notification (when the app is in the background)
    messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
            "Notification caused app to open from background state:",
            remoteMessage.data.screen,
            navigation
        );
        if (remoteMessage?.data?.screen) {
            navigation.navigate(`${remoteMessage.data.screen}`);
        }
    });

    // Check if the app was opened from a notification (when the app was completely quit)
    messaging()
        .getInitialNotification()
        .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            if (remoteMessage) {
                console.log(
                    "Notification caused app to open from quit state:",
                    remoteMessage.notification
                );
                if (remoteMessage?.data?.screen) {
                    navigation.navigate(`${remoteMessage.data.screen}`);
                }
            }
        });

    // Handle push notifications when the app is in the background
    messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);

        if(remoteMessage && remoteMessage.notification && remoteMessage.data){
            const notification = {
                title: remoteMessage.notification.title,
                body: remoteMessage.notification.body,
                data: remoteMessage.data, // optional data payload
            };

            // Schedule the notification with a null trigger to show immediately
            await Notifications.scheduleNotificationAsync({
                content: notification,
                trigger: null,
            });
        }

    });

    // Handle push notifications when the app is in the foreground
    const handlePushNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const notification = {
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: remoteMessage.data, // optional data payload
        };

        // Schedule the notification with a null trigger to show immediately
        await Notifications.scheduleNotificationAsync({
            content: notification,
            trigger: null,
        });
    };

    // Listen for push notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(handlePushNotification);

    // Clean up the event listeners
    return () => {
        unsubscribe();
        notificationClickSubscription.remove();
    };
}