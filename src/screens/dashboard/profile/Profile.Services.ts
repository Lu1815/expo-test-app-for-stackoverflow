import { BottomSheetModal } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { useI18n } from '../../../utils/contexts/i18nContext';
import { TAccountOptions } from '../../../utils/entities/AccountOptions';
import { TFollows } from '../../../utils/entities/Follows';
import { TPostSnapshot, TPosts } from "../../../utils/entities/Posts";
import { TUserDetails } from "../../../utils/entities/UserDetails";
import { useNavigationGH } from '../../../utils/hooks/UseNavigation';
import { FirestoreCollections, ScreenNamesEnum, ScreenRoutes, TScreenNames } from "../../../utils/lib/Consts";
import { errorToast, infoToast } from "../../../utils/lib/Toasts";
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../../utils/lib/firestore/fetchUserDetails';
import { TPostVM } from '../../../utils/viewModels/PostVM';
import { TUserProfileDetailsVM } from "../../../utils/viewModels/UserProfileDetailsVM";

export const _profileService = ({ userId }) => {
    // EXTERNAL STATES/HOOKS
    const { currentUser } = useAuth()
    const { navigation } = useNavigationGH();
    const { i18n } = useI18n();
    const tabBarHeight = useBottomTabBarHeight();

    // LOCAL STATES
    const accountOptionsRef                                       = useRef<TAccountOptions[]>([]);
    const optionsBottomSheetRef                                   = useRef<BottomSheetModal>(null);
    const reportBottomSheetRef                                    = useRef<BottomSheetModal>(null);
    const [isBottomSheetVisible, setBottomSheetVisible]           = useState(false);
    const [isCurrentUserFollowing, setIsCurrentUserFollowing]     = useState<boolean>(false);
    const [isLoading, setIsLoading]                               = useState<boolean>(false);
    const [isProfileFromCurrentUser, setIsProfileFromCurrentUser] = useState<boolean>(false);
    const [modalVisible, setModalVisible]                         = useState(false);
    const [posts, setPosts]                                       = useState<TPostSnapshot[]>([]);
    const [postsVM, setPostsVM]                                   = useState<TPostVM[]>([]);
    const [select, setSelect]                                     = useState(true);
    const [userProfileDetails, setUserProfileDetails]             = useState<TUserProfileDetailsVM>({
        followersCount: 0,
        followingsCount: 0,
        fullName: '',
        postsCount: 0,
        userImageUrl: '',
        userName: '',
        description: ''
    });
    const [viewTabOption, setViewTabOption] = useState<string | null>(i18n.t("profileSwitchLeftLabelText"));
    const [profileActivityOption, setProfileActivityOption] = useState<string | null>();

    // FUNCTIONS
    function checkIfProfileIsFromCurrentUser(): void {
        console.log(`Current user: ${currentUser.uid}, userId: ${userId}`)
        const isProfileFromCurrentUser = currentUser.uid === userId;
        console.log(`Is profile from current user: ${isProfileFromCurrentUser}`)

        if(!userId) {
            setIsProfileFromCurrentUser(true);
            return
        };

        setIsProfileFromCurrentUser(previousValue => previousValue = isProfileFromCurrentUser);
    }

    // #region checkIfCurrentUserIsFollowing
    async function checkIfCurrentUserIsFollowing() {
        try {
            const followDoc = await firestore()
                .collection(FirestoreCollections.FOLLOWS)
                .where("followerId", "==", currentUser.uid)
                .where("followingId", "==", userId)
                .get();

            if (followDoc.size > 0) {
                setIsCurrentUserFollowing(true);
            } else {
                setIsCurrentUserFollowing(false);
            }
        } catch (err) {
            errorLogger(
                err,
                "Error during checkIfCurrentUserIsFollowing > _profileService.checkIfCurrentUserIsFollowing function."
            )
            errorToast(err.message);
        }
    }

    // #region fetchPosts
    async function fetchPosts() {
        setIsLoading(true);
        try {
            const q = firestore()
                .collection("posts")
                .where("userId", "==", userId || currentUser.uid);

            const querySnapshot = await q.get();
            const postsData: TPostSnapshot[] = querySnapshot.docs.map(doc => (
                {
                    id: doc.id,
                    data: {
                        ...doc.data() as TPosts
                    }
                } as TPostSnapshot
            ));

            const sortedPosts = postsData.sort((a, b) => {
                const dateA = new Date(a.data.createdAt).getTime();
                const dateB = new Date(b.data.createdAt).getTime();
                return dateB - dateA;
            });

            const postsVM: TPostVM[] = await Promise.all(sortedPosts.map(async postSnapshot => {
                const userDetails = await fetchUserDetails(postSnapshot.data.userId);
                return {
                    postId: postSnapshot.id,
                    userName: userDetails.userName,
                    postImageUrls: postSnapshot.data.imageUris,
                    location: postSnapshot.data.location,
                    locationDetails: postSnapshot.data.locationDetails,
                    tags: postSnapshot.data.tags,
                    caption: postSnapshot.data.caption,
                    likes: postSnapshot.data.likesCount,
                    comments: postSnapshot.data.commentsCount,
                    shares: postSnapshot.data.sharesCount,
                    profilePictureUri: userDetails.picture
                };
            }));

            setPosts(sortedPosts);
            setPostsVM(postsVM);
        } catch (err) {
            errorLogger(
                err,
                "Error during fetchPosts > _profileService.fetchPosts function."
            )

            errorToast(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // #region followHandler
    async function followHandler() {
        if (isCurrentUserFollowing) {
            unfollowHandler();
            return;
        }

        setIsCurrentUserFollowing(true);
        setIsLoading(true)
        try {
            const newFollowDoc: TFollows = {
                followerId: currentUser.uid,
                followingId: userId,
                followedAt: new Date(),
                followedAtTimestamp: firestore.Timestamp.now().toMillis()
            }

            await firestore()
                .collection(FirestoreCollections.FOLLOWS)
                .doc()
                .set(newFollowDoc);

            await firestore().doc(`${FirestoreCollections.USER_DETAILS}/${currentUser.uid}`).update({
                followingsCount: firestore.FieldValue.increment(1)
            }).catch(err => {
                throw new Error(err.message);
            });

            await firestore().doc(`${FirestoreCollections.USER_DETAILS}/${userId}`).update({
                followersCount: firestore.FieldValue.increment(1)
            }).catch(err => {
                throw new Error(err.message);
            })

            await getUserInfo();
        } catch (err) {
            errorLogger(
                err,
                "Error during followHandler > _profileService.followHandler function."
            )

            errorToast(err.message);
            setIsCurrentUserFollowing(false);
        } finally {
            setIsLoading(false)
        }
    }

    // #region handleActivityOptionPress
    async function handleActivityOptionPress(option: string, navigatingFrom: TScreenNames = "Profile") {
        if(option !== i18n.t("profileFollowersText") && option !== i18n.t("profileFollowingText")) {
            handleProfileFeedNavigation("", navigatingFrom);
            return
        };

        const userDetails = await fetchUserDetails(userId || currentUser.uid);

        if(userDetails.followersCount === 0 && isProfileFromCurrentUser && option === i18n.t("profileFollowersText")) {
            infoToast(i18n.t("profileNoFollowersText"));
            return;
        } else if (userDetails.followingsCount === 0 && isProfileFromCurrentUser && option === i18n.t("profileFollowingText")) {
            infoToast(i18n.t("profileNoFollowingText"));
            return;
        } else if (userDetails.followersCount === 0 && !isProfileFromCurrentUser && option === i18n.t("profileFollowersText")) {
            infoToast(i18n.t("userNoFollowersText"));
            return;
        } else if (userDetails.followingsCount === 0 && !isProfileFromCurrentUser && option === i18n.t("profileFollowingText")) {
            infoToast(i18n.t("userNoFollowingText"));
            return;
        }

        const listTypeObject: { [key: string]: string } = {
            [i18n.t("profileFollowersText")]: i18n.locale === "es" ? "followers" : i18n.t("profileFollowersText").toLowerCase(),
            [i18n.t("profileFollowingText")]: i18n.locale === "es" ? "following" : i18n.t("profileFollowingText").toLowerCase(),
        };

        const navigationObject: { [key: string]: string } = {
            [ScreenNamesEnum.SEARCH]: ScreenRoutes.SEARCH_PROFILE_FOLLOWS,
            [ScreenNamesEnum.PROFILE]: ScreenRoutes.PROFILE_FOLLOWS,
            [ScreenNamesEnum.FEED]: ScreenRoutes.FEED_PROFILE_FOLLOWS,
            [ScreenNamesEnum.BOOKMARKS]: ScreenRoutes.BOOKMARK_PROFILE_FOLLOWS,
        };

        navigation.navigate(navigationObject[navigatingFrom], {
            listType: listTypeObject[option],
            userId: userId || currentUser.uid,
        });
    }

    // #region getAccountOptions
    async function getAccountOptions() {
        // Get the post options from firestore and set the postOptionsList depending on the user selected language
        const accountOptionsCollection = FirestoreCollections.ACCOUNTS_OPTIONS;
        const accountOptionLocaleDoc = i18n.locale;
        const optionsSubcollection = FirestoreCollections.OPTIONS;

        try {
            const optionsSnapshot = await firestore()
                .collection(`${accountOptionsCollection}/${accountOptionLocaleDoc}/${optionsSubcollection}`)
                .get();

            if (optionsSnapshot.empty) {
                console.log("No options found");
                return [];
            }

            const options = optionsSnapshot.docs.map(doc => doc.data() as TAccountOptions);

            accountOptionsRef.current = options;
            return options;
        } catch (error) {
            errorLogger(
                error,
                "Error fetching account options > _profileService.getAccountOptions function.",
                currentUser
            )

            errorToast("Error fetching account options. Please try again.")
        }
    }

    // #region getUserInfo
    async function getUserInfo() {
        try {
            let userSnapshotData: TUserDetails;

            const docReference = firestore().doc(`${FirestoreCollections.USER_DETAILS}/${userId || currentUser.uid}`);

            const docSnapshot = await docReference.get();

            if (docSnapshot.exists) {
                userSnapshotData = docSnapshot.data() as TUserDetails;
            } else {
                console.log(`No document found at ${FirestoreCollections.USER_DETAILS}/${userId || currentUser.uid}`);
            }

            const userName: string = userSnapshotData.userName;
            // const fullName: string = userSnapshotData.displayName; // TODO: Add full name to TUSerDetails

            const userDetails: TUserProfileDetailsVM = {
                userName,
                fullName: "", // TODO: Add full name to TUSerDetails
                description: userSnapshotData.description,
                userImageUrl: userSnapshotData.picture,
                postsCount: userSnapshotData.postCount,
                followersCount: userSnapshotData.followersCount,
                followingsCount: userSnapshotData.followingsCount
            }

            setUserProfileDetails(userDetails);
        } catch (err) {
            errorLogger(
                err,
                "Error during getUserInfo > _profileService.getUserInfo function."
            )

            errorToast(i18n.t("profileErrorLoadingProfileDataText"));
        }
    }

    // #region handleOptionPress
    const handleOptionPress = (option: TAccountOptions) => {
        switch (option.name) {
            case i18n.t("postCardReportOptionText"):
                // Open report bottom sheet modal
                // setReportsModalVisible(true);
                reportBottomSheetRef.current?.present();
                break;
            // Add more case if necessary
        }
    };

    // #region handleProfileFeedNavigation
    function handleProfileFeedNavigation(postId: string = "", navigatingFrom: TScreenNames = "Profile") {
        
        const navigationObject: { [key: string]: string } = {
            [ScreenNamesEnum.SEARCH]: ScreenRoutes.SEARCH_PROFILE_FEED,
            [ScreenNamesEnum.PROFILE]: ScreenRoutes.PROFILE_FEED,
            [ScreenNamesEnum.FEED]: ScreenRoutes.FEED_PROFILE_FEED,
            [ScreenNamesEnum.BOOKMARKS]: ScreenRoutes.BOOKMARK_PROFILE_FEED,
        }

        console.log(`Navigating from ${navigatingFrom} to ${navigationObject[navigatingFrom]} with postId: ${postId}`)

        const addStatusBarPaddingTop = navigatingFrom === ScreenNamesEnum.FEED || navigatingFrom === ScreenNamesEnum.SEARCH;

        navigation.navigate(navigationObject[navigatingFrom], {
            focusedPostId: postId, 
            posts: postsVM,
            addStatusBarPaddingTop,
            navigatingFrom,
        });
    }

    // #region switchHandler
    function switchHandler(): void {
        setSelect(!select);
    };

    // #region toggleBottomSheet
    function toggleBottomSheet() { setBottomSheetVisible(prevState => !prevState); }
    // #region toggleOptionsBottomSheet
    function toggleOptionsBottomSheet() { optionsBottomSheetRef.current?.present(); }

    // #region unfollowHandler
    async function unfollowHandler() {
        setIsCurrentUserFollowing(false);
        setIsLoading(true)
        try {
            const followDoc = await firestore()
                .collection(FirestoreCollections.FOLLOWS)
                .where("followerId", "==", currentUser.uid)
                .where("followingId", "==", userId)
                .get();

            followDoc.forEach(async doc => {
                await doc.ref.delete();
            });

            await firestore().doc(`${FirestoreCollections.USER_DETAILS}/${currentUser.uid}`).update({
                followingsCount: firestore.FieldValue.increment(-1)
            }).catch(err => {
                throw new Error(err.message);
            });

            await firestore().doc(`${FirestoreCollections.USER_DETAILS}/${userId}`).update({
                followersCount: firestore.FieldValue.increment(-1)
            }).catch(err => {
                throw new Error(err.message);
            })

            await getUserInfo();
        } catch (err) {
            errorLogger(
                err,
                "Error during unfollowHandler > _profileService.unfollowHandler function."
            )

            errorToast(err.message);
            setIsCurrentUserFollowing(true);
        } finally {
            setIsLoading(false)
        }
    }

    // USE EFFECTS
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [navigation])
    );

    useEffect(() => {
        getUserInfo()

        if (userId) {
            checkIfCurrentUserIsFollowing()
        }
    }, [posts]);

    useEffect(() => {
        checkIfProfileIsFromCurrentUser();
        (async () => {
            await getAccountOptions();
        })();
    }, []);

    return {
        followHandler,
        handleProfileFeedNavigation,
        i18n,
        isBottomSheetVisible,
        isCurrentUserFollowing,
        isLoading,
        isProfileFromCurrentUser,
        modalVisible,
        posts,
        postsVM,
        profileActivityOption,
        setBottomSheetVisible,
        setModalVisible,
        setProfileActivityOption,
        setViewTabOption,
        switchHandler,
        tabBarHeight,
        toggleBottomSheet,
        toggleOptionsBottomSheet,
        userProfileDetails,
        userId,
        viewTabOption,
        accountOptionsRef,
        optionsBottomSheetRef,
        handleOptionPress,
        reportBottomSheetRef,
        handleActivityOptionPress
    };
}
