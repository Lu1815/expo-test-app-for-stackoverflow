import firestore from '@react-native-firebase/firestore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Location from "expo-location";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Animated } from 'react-native';
import { useAuth } from '../../../utils/contexts/AuthContext';
import { useI18n } from '../../../utils/contexts/i18nContext';
import { TPosts } from "../../../utils/entities/Posts";
import { TUserDetails } from "../../../utils/entities/UserDetails";
import { useDebounce } from "../../../utils/hooks/UseDebounce";
import { useNavigationGH } from '../../../utils/hooks/UseNavigation';
import { FirestoreCollections, ScreenNamesEnum, ScreenRoutes } from "../../../utils/lib/Consts";
import { generateKeywords } from "../../../utils/lib/GenerateKeywords";
import { errorToast } from "../../../utils/lib/Toasts";
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../../utils/lib/firestore/fetchUserDetails';
import { TPostVM } from "../../../utils/viewModels/PostVM";

export const _searchServices = () => {
    // #region STATES
    // EXTERNAL STATES
    const { currentUser } = useAuth();
    const { i18n } = useI18n();
    const tabBarHeight = useBottomTabBarHeight();
    const { navigation } = useNavigationGH();

    // LOCAL STATES
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [isListOptionSelected, setIsListOptionSelected] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [currentTab, setCurrentTab] = useState<string>(`${i18n.t('searchAccountsTabText')}`);
    const [currentFilter, setCurrentFilter] = useState<string | null>();
    const [data, setData] = useState<TUserDetails[] | TPostVM[]>([]);
    const scrollY = useRef(new Animated.Value(0)).current;
    const searchBarTranslateY = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, -140],
        extrapolate: "clamp",
    });

    const feedSectionTranslateY = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, -120],
        extrapolate: "clamp",
    });

    // #region FUNCTIONS
    // #region getFilterDate
    function getFilterDate(filter: string): number | null {
        const now = new Date();
        const filterDates: { [key: string]: number | null } = {
            [i18n.t("searchFilterOptionToday")]: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
            [i18n.t("searchFilterOptionThisWeek")]: new Date(now.setDate(now.getDate() - now.getDay())).getTime(),
            [i18n.t("searchFilterOptionThisMonth")]: new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
            [i18n.t("searchFilterOptionThisYear")]: new Date(now.getFullYear(), 0, 1).getTime(),
            [i18n.t("searchFilterOptionAllTime")]: null,
        };

        return filterDates[filter] || null;
    };

    // #region handleScroll
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    // FORMIK STATES
    const formik = useFormik({
        initialValues: { searchTerm: '' },
        onSubmit: values => {
            console.log(values);
        },
    });
    const debouncedSearchTerm: string = useDebounce(formik.values.searchTerm, 500); // 500ms delay

    // #region FUNCTIONS
    // #region handleCancel
    function handleCancel() {
        setVisible(false);
    };

    // #region handlerSwitch
    function handlerSwitch(): void {
        setIsListOptionSelected((previousState) => !previousState);
    };

    // #region handleProfileNavigation
    async function handleProfileNavigation(userEmail: string) {
        const userRef = firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .where('userEmail', '==', userEmail)
            .limit(1);

        try{
            const userDetailsSnapshot = await userRef.get();

            if (userDetailsSnapshot.empty) {
                throw new Error("There was a problem getting the user details!");
            }

            const userDetails = userDetailsSnapshot.docs.map(doc => doc.id) as string[];
            const userId = userDetails[0];

            navigation.navigate(
                ScreenRoutes.SEARCH_PROFILE, 
                { 
                    userId: userId, 
                    navigatingFrom: ScreenNamesEnum.SEARCH,
                }
            );
        } catch(error){
            errorLogger(
                error,
                'Error navigating to profile. Search.Services.ts > handleProfileNavigation',
                currentUser
            )
            errorToast(i18n.t('searchErrorNavigatingToProfileText'))
        }
    }

    // #region fetchAccountsOrPosts
    async function fetchAccountsOrPosts() {
        const isListOptionSelectededTab: "Map" | "List" = isListOptionSelected ? "List" : "Map";

        setData([]);
        if (currentTab === i18n.t('searchAccountsTabText') && isListOptionSelectededTab === "List") {
            await fetchAccountsBySearchTerms();
        } else {
            await fetchPostsBySearchTerms();
        }
    }

    // #region fetchAccountsBySearchTerms
    async function fetchAccountsBySearchTerms(): Promise<{ id: number, name: string }[]> {
        setIsLoading(true);
        try {
            const searchTerms = generateKeywords(debouncedSearchTerm);

            if (searchTerms.length === 0) {
                console.log('NO SEARCH TERMS');
                setData([])
                return
            }

            // Step 1: Query the accounts collection for documents matching the search term
            const accountsRef = firestore().collection(FirestoreCollections.USER_DETAILS);
            // const userData: TUserDetails = await fetchUserDetails(currentUser.uid);
            let query = await accountsRef
                .orderBy('userName')
                // .where('userName', '!=', userData.userName)
                .where('searchKeywords', 'array-contains-any', searchTerms)
                .limit(10);

            // Apply filter based on currentFilter
            const filterDate = getFilterDate(currentFilter);
            if (filterDate) {
                query = query.where('createdAtTimestamp', '>=', filterDate);
            }

            const querySnapshot = await query.get();
            if (querySnapshot.empty) {
                console.log('NO MATCHING DOCUMENTS ACCOUNTS');
                setData([])
                return
            }

            const accounts = querySnapshot.docs.map((doc) => doc.data() as TUserDetails);

            setData(accounts)
        } catch (error) {
            console.error("Error fetching accounts:", error);
            errorToast(i18n.t('searchErrorFetchingAccountsText'))
        } finally {
            setIsLoading(false);
        }
    }

    // #region fetchPostsBySearchTerms
    async function fetchPostsBySearchTerms(): Promise<TPostVM[]> {
        setIsLoading(true);
        try {
            // Transform the search term into an array of keywords for querying
            const searchTerms = generateKeywords(debouncedSearchTerm);

            if (searchTerms.length === 0) {
                console.log('NO SEARCH TERMS');
                setData([])
                return
            }

            // Step 2: Query the searchKeywords collection for documents matching each keyword
            const postRef = firestore().collection(FirestoreCollections.POSTS);
            let query = await postRef
                .where('searchKeywords', 'array-contains-any', searchTerms);

            // Apply filter based on currentFilter
            const filterDate = getFilterDate(currentFilter);
            if (filterDate) {
                query = query.where('createdAtTimestamp', '>=', filterDate);
            }

            const querySnapshot = await query.get();
            if (querySnapshot.empty) {
                console.log('NO MATCHING DOCUMENTS POSTS');
                setData([])
                return
            }

            const postsPromises: Promise<TPostVM>[] = querySnapshot.docs.map(async (doc) => {
                const data = doc.data() as TPosts;
                const userData: TUserDetails = await fetchUserDetails(data.userId);

                return transformToPostVM(doc, userData, data);
            });

            const posts: TPostVM[] = await Promise.all(postsPromises);

            setData(posts)
        } catch (error) {
            errorLogger(
                error,
                'Error fetching posts. Search.Services.ts > fetchPostsBySearchTerms',
                currentUser
            )

            errorToast(i18n.t('searchErrorFetchingPostsText'))
        } finally {
            setIsLoading(false);
        }
    };

    // #region showDialog
    function showDialog() {
        setVisible(true);
    };

    // #region transformToPostVM
    function transformToPostVM(document: any, userData: TUserDetails, postData: TPosts): TPostVM {
        return {
            postId: document.id,
            userName: userData.userName,
            postImageUrls: postData.imageUris,
            location: postData.location,
            locationDetails: postData.locationDetails,
            tags: postData.tags,
            caption: postData.caption,
            likes: postData.likesCount,
            comments: postData.commentsCount,
            shares: postData.sharesCount,
            profilePictureUri: userData.picture ? userData.picture : undefined,
        };
    };

    // #region USEEFFECT
    useEffect(() => {
        if (!debouncedSearchTerm) {
            setData([]);
            return;
        }

        fetchAccountsOrPosts();
    }, [currentTab, debouncedSearchTerm, isListOptionSelected, currentFilter]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            try{
                let location: Location.LocationObject = await Location.getCurrentPositionAsync({});
                    
                setInitialRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
    
                setIsLoading(false);
            } catch (error){
                console.error('Error getting location:', error)
                setErrorMsg('Error getting location')
            }
        })();
    }, []);

    // #region RETURN
    return {
        isLoading,
        visible,
        isListOptionSelected,
        errorMsg,
        initialRegion,
        currentTab,
        currentFilter,
        data,
        handleProfileNavigation,
        handlerSwitch,
        showDialog,
        handleCancel,
        setCurrentTab,
        setCurrentFilter,
        formik,
        i18n,
        tabBarHeight,
        handleScroll,
        searchBarTranslateY,
        feedSectionTranslateY
    };
}