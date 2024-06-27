import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../../../utils/contexts/i18nContext";
import { TPosts } from "../../../../utils/entities";
import { IBookmarks, TUserDetails } from "../../../../utils/entities/UserDetails";
import { useNavigationGH } from "../../../../utils/hooks/UseNavigation";
import { FirestoreCollections, ScreenRoutes } from "../../../../utils/lib/Consts";
import { errorToast, successToast } from "../../../../utils/lib/Toasts";
import { transformToPostVM } from "../../../../utils/lib/TransformToPostVM";
import { errorLogger } from "../../../../utils/lib/errors/ErrorLogger";
import { fetchUserDetails } from "../../../../utils/lib/firestore/fetchUserDetails";
import { TPostVM } from "../../../../utils/viewModels/PostVM";

export const _addbookmarkcollectionService = () => {
    const { navigation } = useNavigationGH();
    const { i18n } = useI18n();

    const [posts, setPosts] = useState<TPostVM[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    // WE COULD ONLY USE THE STATE HERE, BUT FOR SOME REASON THE STATE WAS NOT UPDATING
    // SO I DECIDED TO USE REF AS A TEMPORARY SOLUTION WHILE I FIGURE OUT WHY THE STATE WAS NOT UPDATING
    const selectedImagesRef = useRef<string[]>([]);

    async function addPostsToCollection(collectionId: string) {
        if(selectedImagesRef.current.length === 0) {
            errorToast(i18n.t("noSelectedPostsToAdd"));
            return
        }

        const collectionRef = firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .doc(auth().currentUser.uid)
            .collection(FirestoreCollections.BOOKMARKS)
            .doc(collectionId)
            .collection(FirestoreCollections.BOOKMARKS);

        const bookmarkCollectionRef = firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .doc(auth().currentUser.uid)
            .collection(FirestoreCollections.BOOKMARKS)
            .doc(collectionId);

        try {
            const batch = firestore().batch();

            for (const postId of selectedImagesRef.current) {
                const postDocRef = firestore().collection(FirestoreCollections.POSTS).doc(postId);
                const postSnapshot = await postDocRef.get();

                if (!postSnapshot.exists) {
                    continue; // Skip this postId if the document does not exist
                }

                const postData = postSnapshot.data() as TPosts;

                let userData;
                try {
                    userData = await fetchUserDetails(postData.userId);
                } catch (fetchError) {
                    console.error(`Error fetching user details for postId ${postId}:`, fetchError);
                    continue; // Skip this postId if fetching user details fails
                }

                const newBookmark: IBookmarks = {
                    postId,
                    postAuthor: userData.userName,
                    postThumbail: postData.imageUris[0],
                    postTitle: postData.caption,
                };

                const newBookmarkRef = collectionRef.doc(postId);
                batch.set(newBookmarkRef, newBookmark);
            }

            await batch.commit();

            // Update optionImage for the collection
            if (selectedImagesRef.current.length > 0) {
                const postDocRef = firestore().collection(FirestoreCollections.POSTS).doc(selectedImagesRef.current[0]);
                const postDocSnapshot = await postDocRef.get();
                const postImage = postDocSnapshot.data() as TPosts;

                await bookmarkCollectionRef.update({
                    optionImage: postImage.imageUris[0],
                });
            } else {
                await bookmarkCollectionRef.update({
                    optionImage: "",
                });
            }

            successToast("Posts added to collection");
            navigation.navigate(ScreenRoutes.BOOKMARK)
        } catch (error) {
            errorLogger(
                error,
                "AddBookmarkCollectionService.ts > addPostsToCollection : Error while adding posts to collection",
                auth().currentUser
            );
            errorToast("Error while adding posts to collection");
        }
    }

    async function getBookmarkCollectionsPosts() {
        const collectionRef = firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .doc(auth().currentUser.uid)
            .collection(FirestoreCollections.BOOKMARKS);

        try {
            const snapshot = await collectionRef.get();
            const postIdsListPromises: Promise<string[]>[] = snapshot.docs.map(async (doc) => {
                const collectionBookmarksRef = collectionRef
                    .doc(doc.id)
                    .collection(FirestoreCollections.BOOKMARKS);

                const snapshot = await collectionBookmarksRef.get();

                if (snapshot.empty) {
                    return [];
                }

                const postsIds: string[] = snapshot.docs.map((doc) => {
                    const data = doc.data() as IBookmarks;

                    return data.postId;
                });

                return postsIds;
            })

            const postIdsList: string[] = (await Promise.all(postIdsListPromises)).flat(1);

            const postsCollectionRef = firestore().collection(FirestoreCollections.POSTS);
            const postsPromises: Promise<TPostVM>[] = postIdsList.map(async (postId) => {
                const postDoc = await postsCollectionRef.doc(postId).get();
                const postData = postDoc.data() as TPosts;

                const userDocRef = firestore().collection(FirestoreCollections.USER_DETAILS).doc(postData.userId);
                const userDocSnapshot = await userDocRef.get();

                if (!userDocSnapshot.exists) {
                    return null;
                }

                const userData = userDocSnapshot.data() as TUserDetails;

                return transformToPostVM(postId, userData, postData);
            });

            const posts = await Promise.all(postsPromises);

            setPosts(posts);
        } catch (error) {
            errorLogger(
                error,
                "AddBookmarkCollectionService.ts > getBookmarkCollectionsPosts : Error while fetching bookmark collections posts",
                auth().currentUser
            )
            errorToast("Error while fetching bookmark collections posts");
        }
    }

    function handleNavigateToCreateBookmarkCollection() {
        if (selectedImagesRef.current.length === 0) {
            errorToast(i18n.t("noSelectedPostsToAdd"));
            return;
        }

        navigation.navigate(ScreenRoutes.BOOKMARK_CREATE_COLLECTION, {
            postIds: selectedImagesRef.current,
        });
    }

    function handleSelectionChange(selections: string[]) {
        selectedImagesRef.current = selections;
        setSelectedImages(previousValue => previousValue = selections);
    };

    useEffect(() => {
        getBookmarkCollectionsPosts();
    }, []);

    return {
        addPostsToCollection,
        handleNavigateToCreateBookmarkCollection,
        handleSelectionChange,
        i18n,
        selectedImages,
        navigation,
        posts,
    }
}
