import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useI18n } from "../../../utils/contexts/i18nContext";
import { TPosts } from "../../../utils/entities";
import { IBookmarks, TUserDetails } from "../../../utils/entities/UserDetails";
import { useNavigationGH } from "../../../utils/hooks/UseNavigation";
import { FirestoreCollections, ScreenNamesEnum } from "../../../utils/lib/Consts";
import { errorToast, successToast } from "../../../utils/lib/Toasts";
import { errorLogger } from "../../../utils/lib/errors/ErrorLogger";
import { TPostVM } from "../../../utils/viewModels/PostVM";
import { IOptionsVM } from "../../../utils/viewModels/ReportsCategoriesVM";

export const _bookMarkServices = () => {
    // #region STATES
    // EXTERNAL STATES
    const { i18n } = useI18n();
    const { navigation } = useNavigationGH();

    // LOCAL STATES
    const collectionIdRef = useRef<string>("");
    const [bookmarkCollections, setBookmarkCollections] = useState<IOptionsVM[]>([]);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    // #region FUNCTIONS
    async function getUserBookmarksCollections(){
        try {
            const snapshot = await firestore()
                .collection(FirestoreCollections.USER_DETAILS)
                .doc(auth().currentUser.uid)
                .collection(FirestoreCollections.BOOKMARKS)
                .get();
            
            if (snapshot.empty) {
                console.log('This user has no collections.');
                return [];
            }

            const bookmarkCollections = snapshot.docs.map(doc => { 
                return {
                    ...doc.data(), 
                    id: doc.id
                } 
            }) as IOptionsVM[];

            if(i18n.locale === 'es'){
                const bookmarks: IOptionsVM[] = bookmarkCollections.map((collection) => {
                    if(collection.name === 'See later'){
                        return { ...collection, name: 'Ver más tarde' } as IOptionsVM;
                    }

                    return collection as IOptionsVM;
                });

                setBookmarkCollections(bookmarks);
                return;
            }

            setBookmarkCollections(bookmarkCollections);
        } catch (error) {
            errorLogger(
                error,
                "Bookmark.Services.ts > getUserBookmarksCollections: Error fetching bookmark collections",
                auth().currentUser
            );
        }
    }

    async function getPostsFromBookmarkCollection(collectionId: string) {
        try {
            const userId = auth().currentUser.uid;
            
            const collectionSnapshot = await firestore()
                .collection(FirestoreCollections.USER_DETAILS)
                .doc(userId)
                .collection(FirestoreCollections.BOOKMARKS)
                .doc(collectionId)
                .collection(FirestoreCollections.BOOKMARKS)
                .get();
    
            if (collectionSnapshot.empty) {
                console.log('No such collection!');
                return [];
            }
    
            const bookmarksCollection: IBookmarks[] = collectionSnapshot.docs.map(doc => doc.data() as IBookmarks);
    
            const posts = await Promise.all(bookmarksCollection.map(async (bookmark: IBookmarks) => {
                const postSnapshot = await firestore()
                    .collection(FirestoreCollections.POSTS)
                    .doc(bookmark.postId)
                    .get();

                if (!postSnapshot.exists) return null;

                const postData = postSnapshot.data() as TPosts;

                const userSnapshot = await firestore()
                    .collection(FirestoreCollections.USER_DETAILS)
                    .doc(postData.userId)
                    .get();

                if (!userSnapshot.exists) return null;
                
                const userData = userSnapshot.data() as TUserDetails;

                return transformToPostVM(postSnapshot, userData, postData);
            }));
    
            const validPosts = posts.filter(post => post !== null);
            return validPosts;
        } catch (error) {
            errorLogger(
                error,
                "Bookmark.Services.ts > getPostsFromBookmarkCollection: Error fetching posts from bookmark collection",
                auth().currentUser
            );
            return [];
        }
    }

    // #region handleBookmarkFeedNavigation
    async function handleBookmarkFeedNavigation(bookmarkCollectionId: string) {
        const postsVM = await getPostsFromBookmarkCollection(bookmarkCollectionId);

        navigation.navigate("Bookmark.Feed", {
            posts: postsVM,
            navigatingFrom: ScreenNamesEnum.BOOKMARKS,
            addStatusBarPaddingTop: false,
            bookmarkCollectionId
        });
    }

    async function handleDeleteConfirm(collectionId: string){
        const collectionRef = firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .doc(auth().currentUser.uid)
            .collection(FirestoreCollections.BOOKMARKS)
            .doc(collectionId);

        try{
            await collectionRef.delete();
            setDeleteModalVisible(false);

            successToast("Bookmark collection deleted successfully");
            getUserBookmarksCollections();
        } catch (error){
            errorLogger(
                error,
                "Bookmark.Services.ts > handleDeleteConfirm: Error deleting bookmark collection",
                auth().currentUser
            );
            errorToast("Error deleting bookmark collection")
        }
    }

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

    // #region USE EFFECTS
    useFocusEffect(
        useCallback(() => {
            getUserBookmarksCollections();
        }, [])
    );

    return {
        bookmarkCollections,
        collectionIdRef,
        handleBookmarkFeedNavigation,
        handleDeleteConfirm,
        i18n,
        isDeleteModalVisible,
        setDeleteModalVisible
    }
};