import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import * as Location from 'expo-location';
import { useEffect } from "react";
import { useNavigationGH } from '../../../utils/hooks/UseNavigation';
import { FirestoreCollections } from '../../../utils/lib/Consts';
import { requestUserPermission } from "../../../utils/lib/fcm/RequestUserPermission";
import { setupPushNotifications } from "../../../utils/lib/fcm/SetPushNotifications";

export const _tabsNavigatorService = () => {
    const { navigation } = useNavigationGH();

    // #region checkIfDeviceTokenExists
    async function checkIfDeviceTokenExists() {
        const deviceToken = await messaging().getToken();        
        const userDocRef = firestore().doc(`${FirestoreCollections.USER_DETAILS}/${auth().currentUser.uid}`);
        const userDocSnapshot = await userDocRef.get();
    
        if (!userDocSnapshot.exists) {
            return { doesDeviceTokenExist: false, deviceToken };
        }
    
        const userData = userDocSnapshot.data();
        const doesDeviceTokenExist = userData?.devicesTokens && userData.devicesTokens.includes(deviceToken);
    
        return { doesDeviceTokenExist, deviceToken };
    }

    // #region addDeviceTokenToUser
    async function addDeviceTokenToUser() {
        const { doesDeviceTokenExist, deviceToken } = await checkIfDeviceTokenExists();

        if (doesDeviceTokenExist) {
            return;
        }

        const userDoc = firestore().doc(`${FirestoreCollections.USER_DETAILS}/${auth().currentUser?.uid}`);
        userDoc.update({
            devicesTokens: firestore.FieldValue.arrayUnion(deviceToken)
        });
    }


    // #region USEEFFECTS
    useEffect(() => {
        (async () => {
            if (requestUserPermission()) {
                await addDeviceTokenToUser();
            }

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            let streetLoad: Location.LocationGeocodedAddress[] =
                await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

            // Updated the last known location of the user in the database
            // This is used to show the user's last known location in the app

            const userRef = firestore().doc(
                `${FirestoreCollections.USER_DETAILS}/${auth().currentUser?.uid}`
            );
            userRef.update({
                lastKnownLocationName: streetLoad[0].name,
                lastKnownLocationDetails: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
            });
        })();
    }, []);

    // #region NOTIFICATIONS USEEFFECT
    useEffect(() => {
        let cleanup;

        if (requestUserPermission()) {
            setupPushNotifications(navigation).then((result) => {
                cleanup = result;
            });
        }

        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, []);

    return {}
}