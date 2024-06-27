import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useEffect, useRef, useState } from "react";
import { FlatList } from 'react-native';
import { useAuth } from '../../../utils/contexts/AuthContext';
import { useI18n } from '../../../utils/contexts/i18nContext';
import { TPosts } from "../../../utils/entities/Posts";
import useLocation from '../../../utils/hooks/UseLocation';
import { useNavigationGH } from '../../../utils/hooks/UseNavigation';
import { FirestoreCollections, ScreenRoutes } from "../../../utils/lib/Consts";
import { generateGUID } from '../../../utils/lib/GUIDGenerator';
import { shuffleArray } from '../../../utils/lib/ShuffleArray';
import { errorToast } from "../../../utils/lib/Toasts";
import { errorLogger } from '../../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../../utils/lib/firestore/fetchUserDetails';
import { TPostVM } from "../../../utils/viewModels/PostVM";

const POSTS_PER_PAGE = 10;
type TFeedServiceProps = {
    routePostsParams: TPostVM[];
    focusedPostId: string;
}

type TAdPost = {
    postId: string;
    isAd: boolean;
};

export type TFeedItem = TPostVM | TAdPost;

export const _feedService = ({ routePostsParams, focusedPostId }: TFeedServiceProps) => {
    // #region STATES
    // EXTERNAL STATES
    const { currentUser } = useAuth();
    const { i18n } = useI18n();
    const { initialRegion } = useLocation();
    const { navigation } = useNavigationGH();
    const tabBarHeight = useBottomTabBarHeight();

    // LOCAL STATES
    const flatListRef = useRef<FlatList | null>(null);
    const focusTime = useRef<Date | null>(null);
    const [posts, setPosts] = useState<TFeedItem[]>(routePostsParams || []);
    const [routePosts, setRoutePosts] = useState<TPostVM[]>(routePostsParams || []);
    const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>(null);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isRefreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [select, setSelect] = useState(true);

    //#region FUNCTIONS

    function handleNavigateToAddBookmarkScreen(bookmarkCollectionId: string) {
        console.log("Navigating to add bookmark screen with collectionId:", bookmarkCollectionId);

        navigation.navigate(ScreenRoutes.BOOKMARK_ADD_COLLECTION, {
            addPostsToExistingCollection: true,
            collectionId: bookmarkCollectionId,
        });
    }

    // #region createPostsQuery
    // Separates the query creation logic into its own function for clarity.
    function createPostsQuery(isRefreshing = false): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> {
        let query = firestore()
            .collection(FirestoreCollections.POSTS)
            .orderBy('userId')
            .where('userId', '!=', currentUser.uid)
            .where('isPrivate', '==', false)
            .orderBy("createdAtTimestamp", "desc")
            .limit(POSTS_PER_PAGE);

        if (lastVisible && !isRefreshing) {
            query = query.startAfter(lastVisible);
        }

        return query;
    };

    // #region transformToPostVM
    // Transforms document data into post view model format.
    function transformToPostVM(document, userData, postData): TPostVM {
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

    // #region insertAdsRandomly
    // Adds ads to posts array at random intervals.
    function insertAdsRandomly(newPosts): TFeedItem[] {
        return newPosts.reduce((acc, post, index) => {
            if (index % 5 === 0 && Math.random() < 0.5) {
                acc.push({ postId: `ad_${index}_${generateGUID()}`, isAd: true }); // Inserts an ad every 5 posts (randomly)
            }
            acc.push(post);
            return acc;
        }, []);
    };

    // #region fetchPosts
    async function fetchPosts(isRefreshing = false) {
        if (loading || routePostsParams){
            return
        };
        setIsFetchingMore(!lastVisible); // Set to true only if not the initial load
        setLoading(true);

        const q = createPostsQuery(isRefreshing);

        try {
            const documentSnapshots = await q.get();

            const fetchUserDetailsPromises = documentSnapshots.docs.map(async (document) => {
                const postData = document.data() as TPosts;
                const userData = await fetchUserDetails(postData.userId);
                return transformToPostVM(document, userData, postData);
            });

            let newPosts: TFeedItem[] = await Promise.all(fetchUserDetailsPromises);

            if (isRefreshing) {
                setPosts(newPosts);
                setLoading(false);
                return;
            }

            const lastVisiblePost = documentSnapshots.docs[documentSnapshots.docs.length - 1];

            setLastVisible(lastVisiblePost);
            setHasMore(documentSnapshots.docs.length === POSTS_PER_PAGE);

            newPosts = insertAdsRandomly(newPosts);
            newPosts = shuffleArray<TFeedItem>(newPosts);

            setPosts(prevPosts => [...prevPosts, ...newPosts]);
        } catch (error) {
            errorLogger(
                error,
                "Error fetching posts > _feedService.fetchPosts function.",
                currentUser
            )

            errorToast(error.message);
            setHasMore(false);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    // #region handlerSwitch
    function handlerSwitch(): void {
        setSelect((previousState) => !previousState);
    };

    // #region loadMorePosts
    function loadMorePosts() {
        if (!loading && hasMore && !isFetchingMore) {
            fetchPosts();
        }
    };

    // #region onRefresh
    function onRefresh() {
        setRefreshing(previousValue => previousValue = true);
        fetchPosts(true).then(() => setRefreshing(false));
    };

    // #region USE EFFECTS
    useEffect(() => {
        fetchPosts();
    }, [])

    // UseEffect to update routePosts when routePostsParams changes
    useEffect(() => {
        setRoutePosts(routePostsParams || []);
    }, [routePostsParams]);

    useEffect(() => {        
        if (focusedPostId && routePosts.length > 0 && flatListRef.current) {
            const index = routePosts.findIndex((p) => p.postId === focusedPostId);
            if (index >= 0) {
                flatListRef.current.scrollToIndex({ animated: true, index: index });
            }
        }
    }, [focusedPostId, routePosts]);

    return {
        loadMorePosts,
        posts, 
        loading, 
        isFetchingMore, 
        isRefreshing, 
        onRefresh, 
        flatListRef, 
        routePosts, 
        lastVisible, 
        select, 
        handlerSwitch, 
        handleNavigateToAddBookmarkScreen,
        i18n,
        initialRegion,
        tabBarHeight
    }
}
