import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import MapView, { Region } from "react-native-maps";
import { useNavigationGH } from "../../utils/hooks/UseNavigation";
import { ScreenNamesEnum, ScreenRoutes, TScreenNames } from "../../utils/lib/Consts";
import { TPostVM } from "../../utils/viewModels/PostVM";

export const _mapService = ({ posts, postParam }) => {
    const { navigation } = useNavigationGH();

    const postsRef = useRef<TPostVM[]>(posts);
    const [initialRegion, setInitialRegion] = useState<Region>(null);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef<MapView>(null);
    
    function findFirstValidPostLocation() {
        const postsArray = postParam ? [postParam] : posts;
        for (const post of postsArray) {
            const locationDetails = post.locationDetails;
            if (
                locationDetails &&
                locationDetails.latitude &&
                locationDetails.longitude
            ) {
                return locationDetails;
            }
        }
        return null;
    };

    function getMarkerIdentifiers(posts) {
        console.log(`Getting marker identifiers for posts: ${JSON.stringify(posts, null, 2)}`)

        return posts.map((post) => `marker_${post.postId}`);
    };

    function handlePostNavigation(post: TPostVM, navigatingFrom: TScreenNames) {
        const navigationObject: { [key: string]: ScreenRoutes } = {
            [ScreenNamesEnum.FEED]: ScreenRoutes.FEED_POST,
            [ScreenNamesEnum.PROFILE]: ScreenRoutes.PROFILE_POST,
            [ScreenNamesEnum.SEARCH]: ScreenRoutes.SEARCH_POST,
            [ScreenNamesEnum.BOOKMARKS]: ScreenRoutes.BOOKMARK_POST,
        }

        console.log(`Navigating from: ${navigatingFrom} to: ${navigationObject[navigatingFrom]} with post: ${JSON.stringify(post, null, 2)}`)

        navigation.navigate(
            navigationObject[navigatingFrom], 
            {
                post,
                navigatingFrom,
                addStatusBarMarginTop: true,
            }
        );
    }

    function updateMapView() {
        setIsLoading(true);
        if (mapRef && mapRef.current != null && posts.length > 0) {
            const markerIDs = getMarkerIdentifiers(posts);

            if (markerIDs.length > 0) {
                // Used a timeout to allow map to render markers before zooming out.
                setTimeout(() => {
                    mapRef.current?.fitToSuppliedMarkers(markerIDs, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    });
                }, 100); // You might need to adjust this timeout
            }
        }

        setIsLoading(false);
    };

    useFocusEffect(() => {
        updateMapView();
    });

    useEffect(() => {
        (async () => {
            const initialLocationDetails = findFirstValidPostLocation();

            if (initialLocationDetails) {
                setInitialRegion({
                    latitude: initialLocationDetails.latitude,
                    longitude: initialLocationDetails.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            } else {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') { return; }

                let location = await Location.getCurrentPositionAsync({});
                setInitialRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            }
        })();
    }, []);

    return {
        initialRegion,
        isLoading,
        mapRef,
        navigation,
        handlePostNavigation,
    }
}
