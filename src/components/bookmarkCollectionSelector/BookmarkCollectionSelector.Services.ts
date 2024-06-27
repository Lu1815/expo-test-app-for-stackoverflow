import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { useI18n } from '../../utils/contexts/i18nContext';
import { IBookmarks } from '../../utils/entities/UserDetails';
import { FirestoreCollections } from '../../utils/lib/Consts';
import { successToast } from '../../utils/lib/Toasts';
import { errorLogger } from "../../utils/lib/errors/ErrorLogger";
import { IOptionsVM } from '../../utils/viewModels/ReportsCategoriesVM';

export const _bookmarkcollectionselectorService = () => {
    // #region STATES
    // EXTERNAL STATES
    const { i18n } = useI18n();

    // LOCAL STATES
    const [bookmarkCollections, setBookmarkCollections] = useState<IOptionsVM[]>([]);

    // #region FUNCTIONS
    // #region getBookmarkCollections
    async function getBookmarkCollections() {
        const userDetailsCol = FirestoreCollections.USER_DETAILS;
        const userId = auth().currentUser.uid;
        const bookmarksCol = FirestoreCollections.BOOKMARKS;

        try {
            const snapshot = await firestore()
                .collection(`${userDetailsCol}/${userId}/${bookmarksCol}`)
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

            if (i18n.locale === 'es') {
                const bookmarks: IOptionsVM[] = bookmarkCollections.map((collection) => {
                    if (collection.name === 'See later') {
                        return { ...collection, name: 'Ver más tarde' } as IOptionsVM;
                    }

                    return collection as IOptionsVM;
                });

                setBookmarkCollections(bookmarks);
                return bookmarks;
            }

            setBookmarkCollections([...new Set(bookmarkCollections)]);
            return bookmarkCollections;
        } catch (error) {
            errorLogger(
                error,
                "BookmarkCollectionSelector.Services.ts > getBookmarkCollections: Error fetching bookmark collections",
                auth().currentUser
            );
        }
    }

    async function savePostInBookmarkCollection(selectedBookmarkCollection: IOptionsVM, postInfo: IBookmarks) {
        // save post in bookmark collection
        const userDetailsCol = FirestoreCollections.USER_DETAILS;
        const userId = auth().currentUser.uid;
        const bookmarksCol = FirestoreCollections.BOOKMARKS;
        const bookmarkId = selectedBookmarkCollection.id;

        console.log(`Collection path: ${userDetailsCol}/${userId}/${bookmarksCol}/${bookmarkId}`)

        try {
            const bookmarkSubcollectionRef = firestore()
                .collection(userDetailsCol)
                .doc(userId)
                .collection(bookmarksCol)
                .doc(bookmarkId)
            const snapshot = await bookmarkSubcollectionRef
                .collection(bookmarksCol)
                .where('postId', '==', postInfo.postId)
                .get();

            if (!snapshot.empty) {
                // Post already exists in the bookmark collection, remove it
                const postDoc = snapshot.docs[0];
                await bookmarkSubcollectionRef
                    .collection(bookmarksCol)
                    .doc(postDoc.id)
                    .delete();

                const bookmarkCollectionSnapshot = await bookmarkSubcollectionRef
                    .collection(bookmarksCol)
                    .limit(1)
                    .get();

                if (bookmarkCollectionSnapshot.empty) {
                    await bookmarkSubcollectionRef
                        .update({
                            optionImage: "",
                        })
                    return;
                }

                await bookmarkCollectionSnapshot.forEach(async (doc) => {
                    const data = doc.data() as IBookmarks;

                    await bookmarkSubcollectionRef
                        .update({
                            optionImage: data.postThumbail,
                        })
                });

                successToast("Post removed from bookmark collection");
                return;
            }

            const newBookmark: IBookmarks = {
                postAuthor: postInfo.postAuthor,
                postId: postInfo.postId,
                postThumbail: postInfo.postThumbail,
                postTitle: postInfo.postTitle
            };

            await bookmarkSubcollectionRef
                .collection(bookmarksCol)
                .doc(postInfo.postId)
                .set(newBookmark);

            await bookmarkSubcollectionRef
                .update({
                    optionImage: postInfo.postThumbail,
                })

            successToast(i18n.t("postSavedInBookmarkCollectionText").replace('@', selectedBookmarkCollection.name));
        } catch (error) {
            errorLogger(
                error,
                "BookmarkCollectionSelector.Services.ts > savePostInBookmarkCollection: Error saving post in bookmark collection",
                auth().currentUser
            )
        }
    }

    // #region USE EFFECTS
    useEffect(() => {
        (async () => {
            await getBookmarkCollections();
        })();
    }, []);

    return {
        bookmarkCollections,
        i18n,
        savePostInBookmarkCollection
    }
}
