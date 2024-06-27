import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useI18n } from "../../utils/contexts/i18nContext";
import { TUserDetails } from "../../utils/entities";
import { useNavigationGH } from "../../utils/hooks/UseNavigation";
import { FirestoreCollections, ScreenNamesEnum, ScreenRoutes, TScreenNames } from "../../utils/lib/Consts";
import { errorToast } from "../../utils/lib/Toasts";
import { errorLogger } from "../../utils/lib/errors/ErrorLogger";
import { fetchUserDetails, fetchUserSnapshotByEmail } from "../../utils/lib/firestore/fetchUserDetails";

const USERS_PER_PAGE = 30;
const FOLLOWING_LIST_TYPE = "following";
const FOLLOWERS_LIST_TYPE = "followers";
const FOLLOWER_ID_FIELD = "followerId";
const FOLLOWING_ID_FIELD = "followingId";

type TListTypes = {
    following: typeof FOLLOWING_LIST_TYPE;
    followers: typeof FOLLOWERS_LIST_TYPE;
};

type TUsersListServiceProps = {
    listType: TListTypes[keyof TListTypes];
    userId?: string;
}

export const _followsListService = ({ listType, userId }: TUsersListServiceProps) => {
    // #region EXTERNAL STATES
    const { currentUser } = useAuth();
    const { i18n } = useI18n();
    const { navigation } = useNavigationGH();

    // #region LOCAL STATES
    const [users, setUsers] = useState<TUserDetails[]>([]);
    const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>(null);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isRefreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // #region FUNCTIONS
    // #region createFollowsQuery
    function createFollowsQuery(listType: TListTypes[keyof TListTypes], isRefreshing = false): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> {
        const fieldName = listType === FOLLOWING_LIST_TYPE ? FOLLOWER_ID_FIELD : FOLLOWING_ID_FIELD;
        const userIdForQuery = userId || currentUser.uid;

        let query = firestore()
            .collection(FirestoreCollections.FOLLOWS)
            .where(fieldName, '==', userIdForQuery)
            .orderBy("followedAtTimestamp", "desc")
            .limit(USERS_PER_PAGE);

        if (lastVisible && !isRefreshing) {
            query = query.startAfter(lastVisible);
        }

        return query;
    };

    // #region fetchUsers
    async function fetchUsers() {
        if (isFetchingMore || !hasMore) return;

        setIsFetchingMore(true);
        setLoading(true);

        try {
            const query = createFollowsQuery(listType);
            const snapshot = await query.get();

            if (snapshot.empty) {
                setHasMore(false);
                return;
            }

            // IF THE LIST IF OF TYPE following WE WANT TO RETRIEVE ALL THE USERS THAT WE ARE FOLLOWING, IF NOT WE DO THE OPPOSITE
            const fieldName = listType === FOLLOWING_LIST_TYPE ? FOLLOWING_ID_FIELD : FOLLOWER_ID_FIELD;
            const newUsers: TUserDetails[] = await Promise.all(snapshot.docs.map( async (doc) => {
                console.log(`Fetching user details for ${doc.data()[fieldName]} with field ${fieldName}`);
                const userData: TUserDetails = await fetchUserDetails(doc.data()[fieldName]);
                return userData;
            }));

            setUsers([...users, ...newUsers]);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
            errorLogger(
                error,
                "Error fetching users > _userslistService > fetchUsers",
                currentUser
            )
            errorToast(i18n.t("profileErrorLoadingUsers"));
        } finally {
            setIsFetchingMore(false);
            setLoading(false);
        }
    }

    // #region handleProfileNavigation
    async function handleProfileNavigation(userEmail: string, navigatingFrom: TScreenNames = "Profile") {
        const userDetailsSnapshot = await fetchUserSnapshotByEmail(userEmail);

        const navigationObject: { [key: string]: string } = {
            [ScreenNamesEnum.SEARCH]: ScreenRoutes.SEARCH_PROFILE_PROFILE,
            [ScreenNamesEnum.FEED]: ScreenRoutes.FEED_PROFILE_PROFILE,
            [ScreenNamesEnum.PROFILE]: ScreenRoutes.PROFILE_NOT_CURRENT_USER_PROFILE,
            [ScreenNamesEnum.BOOKMARKS]: ScreenRoutes.BOOKMARK_PROFILE_PROFILE,
        }

        navigation.navigate(
            navigationObject[navigatingFrom],
            {
                userId: userDetailsSnapshot.id,
                navigatingFrom,
                addMenuButton: navigatingFrom === ScreenNamesEnum.PROFILE,
                hideFollowButton: navigatingFrom === ScreenNamesEnum.PROFILE
            }
        );
    }

    // #region loadMoreUsers
    async function loadMoreUsers() {
        if (!loading && hasMore && !isFetchingMore) {
            await fetchUsers();
        }
    };

    // #region onRefresh
    async function onRefresh() {
        setRefreshing(previousValue => previousValue = true);
        await fetchUsers().then(() => setRefreshing(false));
    };

    // #region USE EFFECTS
    useEffect(() => {
        fetchUsers();
    }, [])

    return {
        loadMoreUsers,
        users,
        loading,
        lastVisible,
        isFetchingMore,
        onRefresh,
        isRefreshing,
        handleProfileNavigation
    }
}
