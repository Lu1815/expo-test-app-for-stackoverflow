import { BottomSheetModal } from '@gorhom/bottom-sheet';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as Linking from 'expo-linking';
import { useEffect, useRef, useState } from "react";
import { Share } from "react-native";
import { useI18n } from '../../utils/contexts/i18nContext';
import { TLikesPosts } from "../../utils/entities/LikesPosts";
import { TPosts } from "../../utils/entities/Posts";
import { TUserDetails } from "../../utils/entities/UserDetails";
import { useNavigationGH } from '../../utils/hooks/UseNavigation';
import { FirestoreCollections, PostOptionNames, ScreenNamesEnum, ScreenRoutes, TScreenNames } from "../../utils/lib/Consts";
import { errorToast, infoToast } from '../../utils/lib/Toasts';
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../utils/lib/firestore/fetchUserDetails';
import { TPostVM } from "../../utils/viewModels/PostVM";
import { IOptionsVM } from '../../utils/viewModels/ReportsCategoriesVM';

export type TPostCardServiceProps = {
    uri: string;
    postId: string;
    postLikesCount: number;
    postParam: TPostVM;
    isPostFromSearchScreen?: boolean;
    isPostFromProfileScreen?: boolean;
}

export const _postcardService = ({ uri, postId, postLikesCount, postParam }: TPostCardServiceProps) => {
    // #region STATES
    // EXTERNAL STATES/HOOKS
    const { navigation } = useNavigationGH();
    const { i18n } = useI18n();

    // LOCAL STATES
    const commentsBottomSheetRef                            = useRef<BottomSheetModal>(null);
    const reportBottomSheetRef                              = useRef<BottomSheetModal>(null);
    const postOptionsBottomSheetRef                         = useRef<BottomSheetModal>(null);
    const bookmarksBottomSheetRef                           = useRef<BottomSheetModal>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex]         = useState(0);
    const [isLiked, setIsLiked]                             = useState(false);
    const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible]     = useState(false);
    const [likeCount, setLikeCount]                         = useState<number>(postLikesCount);
    const [likeIconColor, setLikeIconColor]                 = useState("orange");
    const [likeIconName, setLikeIconName]                   = useState("heart-outline");
    const [postDetails, setPostDetails]                     = useState<TPostVM>(postParam);
    const [postOptionsList, setPostOptionsList]             = useState<IOptionsVM[]>([]);

    // #region FUNCTIONS
    // #region checkIfPostBelongsToCurrentUser
    async function checkIfPostBelongsToCurrentUser(postId: string, optionsArg: IOptionsVM[]): Promise<void> {
        try {
            const postRef = firestore().collection(FirestoreCollections.POSTS).doc(postId);
            const postSnap = await postRef.get();

            if (!postSnap.exists) {
                return;
            }

            const postData: TPosts = postSnap.data() as TPosts;

            if (postData.userId === auth().currentUser.uid) {
                const options = optionsArg.filter(option =>
                    option.iconName !== PostOptionNames.REPORT
                    && option.iconName !== PostOptionNames.BOOKMARK
                );
                setPostOptionsList(options);
                return;
            }

            const options = optionsArg.filter(option =>
                option.iconName !== PostOptionNames.EDIT
                && option.iconName !== PostOptionNames.DELETE
            );
            setPostOptionsList(options);
        } catch (error) {
            errorLogger(
                error,
                "Error checking if the post belongs to the current user > _postcardService.checkIfPostBelongsToCurrentUser function.",
                auth().currentUser
            )

            errorToast("Error checking if the post belongs to the current user. Please try again.")
        }
    }

    // #region fetchPostDetails
    async function fetchPostDetails() {
        try {
            const postRef = firestore().doc(`${FirestoreCollections.POSTS}/${postId}`);
            const postSnap = await postRef.get();

            if (!postSnap.exists) {
                return;
            }

            const postData: TPosts = postSnap.data() as TPosts;

            const userData: TUserDetails = await fetchUserDetails(postData.userId);

            const postVM: TPostVM = {
                postId: postSnap.id,
                comments: postData.commentsCount,
                likes: postData.likesCount,
                postImageUrls: postData.imageUris,
                shares: postData.sharesCount,
                tags: postData.tags,
                caption: postData.caption,
                location: postData.location,
                locationDetails: postData.locationDetails,
                userName: userData.userName,
                profilePictureUri: userData.picture,
            };

            return postVM;
        } catch (error) {
            errorLogger(
                error,
                "Error fetching post details > _postcardService.fetchPostDetails function.",
                auth().currentUser
            )
            errorToast("Error fetching post details. Please try again.")
        }
    }

    // #region getPostOptions
    async function getPostOptions() {
        // Get the post options from firestore and set the postOptionsList depending on the user selected language
        const postOptionCollection = FirestoreCollections.POST_OPTIONS;
        const postOptionLocaleDoc = i18n.locale;
        const optionsSubcollection = FirestoreCollections.OPTIONS;

        try {
            const optionsSnapshot = await firestore()
                .collection(`${postOptionCollection}/${postOptionLocaleDoc}/${optionsSubcollection}`)
                .get();

            if (optionsSnapshot.empty) {
                console.log("No options found");
                return [];
            }

            const options = optionsSnapshot.docs.map(doc => doc.data() as IOptionsVM);

            setPostOptionsList(previousOptions => previousOptions = options);
            return options;
        } catch (error) {
            errorLogger(
                error,
                "Error fetching post options > _postcardService.getPostOptions function.",
                auth().currentUser
            )

            errorToast("Error fetching post options. Please try again.")
        }
    }

    // #region handleMapNavigation
    function handleMapNavigation(navigatingFrom: TScreenNames = "Feed") {
        if (!postDetails.locationDetails) return;

        const navigationObject: { [key: string]: string } = {
            [ScreenNamesEnum.PROFILE]: ScreenRoutes.PROFILE_MAP,
            [ScreenNamesEnum.SEARCH]: ScreenRoutes.SEARCH_MAP,
            [ScreenNamesEnum.FEED]: ScreenRoutes.FEED_MAP,
            [ScreenNamesEnum.BOOKMARKS]: ScreenRoutes.BOOKMARK_MAP
        }

        console.log(`NAVIGATING FROM: ${navigatingFrom} to ${navigationObject[navigatingFrom]} with post details: ${JSON.stringify(postDetails, null, 2)}`)

        navigation.navigate(
            navigationObject[navigatingFrom],
            {
                post: postDetails,
                navigatingFrom
            }
        );
    }

    // #region handleOptionsButtonPressed
    async function handleOptionsButtonPressed() {
        // Get the post options from firestore and set the postOptionsLis`t depending on the user selected language
        getPostOptions().then((result) => {
            checkIfPostBelongsToCurrentUser(postId, result);
            postOptionsBottomSheetRef.current?.present();
        });
    }

    // #region handleProfileNavigation
    async function handleProfileNavigation(navigatingFrom: TScreenNames = "Feed") {
        const postRef = firestore().doc(`${FirestoreCollections.POSTS}/${postId}`);
        const postDetailsSnapshot = await postRef.get();

        if (!postDetailsSnapshot.exists) {
            throw new Error("There was a problem getting the post details!");
        }

        const postDetails = postDetailsSnapshot.data() as TPosts;

        const navigationObject: { [key: string]: string } = {
            [ScreenNamesEnum.SEARCH]: ScreenRoutes.SEARCH_PROFILE,
            [ScreenNamesEnum.FEED]: ScreenRoutes.FEED_PROFILE,
            [ScreenNamesEnum.PROFILE]: ScreenRoutes.PROFILE_PROFILE,
            [ScreenNamesEnum.BOOKMARKS]: ScreenRoutes.BOOKMARK_PROFILE,
        }

        navigation.navigate(
            navigationObject[navigatingFrom],
            {
                userId: postDetails.userId,
                navigatingFrom,
                addMenuButton: navigatingFrom === ScreenNamesEnum.PROFILE,
                hideFollowButton: navigatingFrom === ScreenNamesEnum.PROFILE
            }
        );
    }

    // #region fetchLikeStatus
    async function fetchLikeStatus() {
        try {
            const querySnapshot = await firestore()
                .collection(FirestoreCollections.LIKES_POSTS)
                .where("postId", "==", postId)
                .where("userId", "==", auth().currentUser.uid)
                .get();

            if (!querySnapshot.empty) {
                setIsLiked(true);
                setLikeIconColor("red");
                setLikeIconName("cards-heart");
            } else {
                setIsLiked(false);
                setLikeIconColor("orange");
                setLikeIconName("heart-outline");
            }
        } catch (error) {
            errorLogger(
                error,
                "Error fetching like status > _postcardService.fetchLikeStatus function.",
                auth().currentUser
            )
        }
    }

    //  #region handleDeleteConfirm
    const handleDeleteConfirm = () => {
        try {
            // DELETE POST FROM posts COLLECTION
            firestore().doc(`${FirestoreCollections.POSTS}/${postId}`).delete();

            // DELETE POST FROM likesPosts COLLECTION
            firestore()
                .collection(FirestoreCollections.LIKES_POSTS)
                .where("postId", "==", postId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });

            // DELETE POST FROM comments COLLECTION
            firestore()
                .collection(FirestoreCollections.COMMENTS)
                .where("postId", "==", postId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });

            // REDUCE THE POST COUNT OF THE USER IN THE users COLLECTION
            firestore().doc(`${FirestoreCollections.USER_DETAILS}/${auth().currentUser.uid}`).update({
                postsCount: firestore.FieldValue.increment(-1)
            });

            // setPostOptionsModalVisible(false);
            postOptionsBottomSheetRef.current?.close();

            infoToast(i18n.t("postCardPostDeletedText"));
            navigation.goBack();
        } catch (error) {
            errorLogger(
                error,
                "Error deleting the post > _postcardService.handleDeleteConfirm function.",
                auth().currentUser
            )

            errorToast(i18n.t("postCardErrorDeletingPostText"));
        } finally {
            setDeleteModalVisible(false);
        }
    };

    // #region handleLikePress
    function handleLikePress() {
        if (isLiked) {
            unlikePost();
        } else {
            likePost();
        }
        setIsLiked(!isLiked);
    };

    // #region handleOptionPress
    const handleOptionPress = (option: IOptionsVM) => {
        switch (option.name) {
            case i18n.t("postCardReportOptionText"):
                // Open report bottom sheet modal
                // setReportsModalVisible(true);
                reportBottomSheetRef.current?.present();
                break;
            case i18n.t("postCardEditOptionText"):
                // Open edit post screen
                // setPostOptionsModalVisible(false);
                postOptionsBottomSheetRef.current?.close();
                navigation.navigate('Profile.Post_Edit', { postId });
                break;
            case i18n.t("postCardDeleteOptionText"):
                // Open edit post screen
                setDeleteModalVisible(true);
                // deleteBottomSheetRef.current?.present();
                break;
            case i18n.t("postCardBookmarkOptionText"):
                // Open bookmark collection selector
                // setPostOptionsModalVisible(false);
                bookmarksBottomSheetRef.current?.present();
                break;
            // Add more case if necessary
        }
    };

    // #region likePost
    async function likePost() {
        setLikeCount(prevLikeCount => prevLikeCount + 1);
        setLikeIconColor("red");
        setLikeIconName("cards-heart");

        try {
            // ADD LIKE TO THE POST BY INSERTING A NEW DOCUMENT IN THE likesPosts COLLECTION
            const collectionReference = await firestore().collection(FirestoreCollections.LIKES_POSTS);
            const newEntity: TLikesPosts = {
                postId,
                userId: auth().currentUser.uid,
                createdAt: new Date().toISOString()
            };
            await collectionReference.add(newEntity);

            // UPDATE LIKES COUNT OF THE POST IN THE posts COLLECTION 
            // BY INCREMENTING THE COUNT BY ONE
            await updateLikesCount();
        } catch (error) {
            errorLogger(
                error,
                "Error liking the post > _postcardService.likePost function.",
                auth().currentUser
            )

            setLikeCount(prevLikeCount => prevLikeCount - 1);
            setLikeIconColor("orange");
            setLikeIconName("heart-outline");
        }
    }

    // #region toggleBottomSheet
    function toggleBottomSheet() { postOptionsBottomSheetRef.current?.present() }

    // #region unlikePost
    async function unlikePost() {
        setLikeCount(prevLikeCount => prevLikeCount - 1);
        setLikeIconColor("orange");
        setLikeIconName("heart-outline");

        try {
            const querySnapshot = await firestore()
                .collection(FirestoreCollections.LIKES_POSTS)
                .where("postId", "==", postId)
                .where("userId", "==", auth().currentUser.uid)
                .get();

            const docRef = firestore().doc(`${FirestoreCollections.LIKES_POSTS}/${querySnapshot.docs[0].id}`);
            await docRef.delete();

            // UPDATE LIKES COUNT OF THE POST IN THE posts COLLECTION 
            // BY DECREMENTING THE COUNT
            await updateLikesCount(false);
        } catch (error) {
            errorLogger(
                error,
                "Error unliking the post > _postcardService.unlikePost function.",
                auth().currentUser
            )

            setLikeCount(prevLikeCount => prevLikeCount + 1);
            setLikeIconColor("red");
            setLikeIconName("cards-heart");
        }
    }

    // #region shareMessage
    async function shareMessage() {
        try {
            const postDetails = await fetchPostDetails();
            const encodedPost = encodeURIComponent(JSON.stringify(postDetails));
            
            const redirectUrl = Linking.createURL(
                'post',
                { queryParams: 
                    { 
                        post: encodedPost, 
                        navigatingFrom: 'Feed', 
                        addStatusBarMarginTop: 'true' 
                    } 
                }
            );

            const result = await Share.share({
                message: `${i18n.t("postCardSharePostMessageText")}\n\nSee the post here: ${redirectUrl}`,
                url: uri,
                title: i18n.t("postCardSharePostTitleText")
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    // shared
                    console.log('Content shared!');
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            errorLogger(
                error,
                "Error while sharing > _postcardService.shareMessage function.",
                auth().currentUser
            )
        }
    };

    // #region updateLikesCount
    async function updateLikesCount(incrementCount: boolean = true) {
        const docReference = firestore().doc(`${FirestoreCollections.POSTS}/${postId}`);
        const postData = (await docReference.get()).data() as TPosts;
        const likesCount: number = postData.likesCount;
        const newLikesCount = incrementCount ? likesCount + 1 : likesCount - 1;
        await docReference.update({
            likesCount: newLikesCount,
        })
    }

    // #region USE EFFECTS
    useEffect(() => {
        (async () => {
            await fetchLikeStatus();
        })();
    }, [])

    useEffect(() => {
        setPostDetails(previousValue => previousValue = postParam);
    }, [postParam])

    useEffect(() => {
        if (!postId) return;

        const postRef = firestore().doc(`${FirestoreCollections.POSTS}/${postId}`);

        const unsubscribe = postRef.onSnapshot(async (docSnap) => {
            if (docSnap.exists) {
                try {
                    const postDetails = docSnap.data() as TPosts;
                    const userData: TUserDetails = await fetchUserDetails(postDetails.userId);

                    const postVM: TPostVM = {
                        postId: docSnap.id,
                        comments: postDetails.commentsCount,
                        likes: postDetails.likesCount,
                        postImageUrls: postDetails.imageUris,
                        shares: postDetails.sharesCount,
                        tags: postDetails.tags,
                        caption: postDetails.caption,
                        location: postDetails.location,
                        locationDetails: postDetails.locationDetails,
                        userName: userData.userName,
                        profilePictureUri: userData.picture,
                    };

                    setPostDetails(postVM);
                } catch (error) {
                    errorLogger(
                        error,
                        "Error fetching post details > _postcardService.useEffect function.",
                        auth().currentUser
                    )
                }
            } else {
                console.log("No such post document!");
            }
        });

        return () => unsubscribe();
    }, [postId]);

    return {
        currentPhotoIndex,
        handleDeleteConfirm,
        handleLikePress,
        handleMapNavigation,
        handleOptionPress,
        handleOptionsButtonPressed,
        handleProfileNavigation,
        i18n,
        isCommentsModalVisible,
        isDeleteModalVisible,
        isLiked,
        likeCount,
        likeIconColor,
        likeIconName,
        postDetails,
        postOptionsList,
        setCurrentPhotoIndex,
        setCommentsModalVisible,
        setDeleteModalVisible,
        shareMessage,
        toggleBottomSheet,
        commentsBottomSheetRef,
        reportBottomSheetRef,
        postOptionsBottomSheetRef,
        bookmarksBottomSheetRef
    }
}
