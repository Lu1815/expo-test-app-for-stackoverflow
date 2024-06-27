import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useI18n } from "../../../../utils/contexts/i18nContext";
import { TPosts } from "../../../../utils/entities";
import { IBookmarks, TUserDetails } from "../../../../utils/entities/UserDetails";
import { useNavigationGH } from "../../../../utils/hooks/UseNavigation";
import { FirestoreCollections, ScreenRoutes } from "../../../../utils/lib/Consts";
import { successToast } from "../../../../utils/lib/Toasts";
import { errorLogger } from "../../../../utils/lib/errors/ErrorLogger";
import { fetchUserDetails } from "../../../../utils/lib/firestore/fetchUserDetails";
import { IOptionsVM } from "../../../../utils/viewModels/ReportsCategoriesVM";

const validationSchema = Yup.object().shape({
    collectionName: Yup.string().required("The collection name is required")
});

type TCreateBookmarkCollectionService = {
    selectedPostIds: string[];
};

export const _createbookmarkcollectionService = ({ selectedPostIds }: TCreateBookmarkCollectionService) => {
    // #region STATES
    // EXTERNAL STATES
    const { i18n } = useI18n();
    const { navigation } = useNavigationGH();

    // LOCAL STATES
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const formik = useFormik({
        initialValues: {
            collectionName: ""
        },
        validationSchema: useMemo(() => validationSchema, []),
        onSubmit: (_) => {
            createBookmarkCollection();
        }
    })

    // #region FUNCTIONS
    async function createBookmarkCollection(){
        const collectionRef = firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .doc(auth().currentUser.uid)
            .collection(FirestoreCollections.BOOKMARKS);

        try {
            const newCollection: IOptionsVM = {
                id: formik.values.collectionName,
                name: formik.values.collectionName,
                optionImage: coverImageUrl
            }

            await collectionRef
                .doc(formik.values.collectionName)
                .set(newCollection);

            selectedPostIds.forEach(async postId => {
                const postDocRef = firestore()
                    .collection(FirestoreCollections.POSTS)
                    .doc(postId);
                const postCollectionSnapshot = await postDocRef.get();
                
                if(!postCollectionSnapshot.exists){
                    return;
                }

                const postDocData = postCollectionSnapshot.data() as TPosts;
                const userData: TUserDetails = await fetchUserDetails(postDocData.userId);

                const newPostForBookmarks: IBookmarks = {
                    postId: postId,
                    postTitle: postDocData.caption,
                    postAuthor: userData.userName,
                    postThumbail: postDocData.imageUris[0]
                }

                await collectionRef
                    .doc(formik.values.collectionName)
                    .collection(FirestoreCollections.BOOKMARKS)
                    .doc(postId)
                    .set(newPostForBookmarks);
            });

            successToast(i18n.t("collectionCreated"));
            navigation.navigate(ScreenRoutes.BOOKMARK);
        } catch (error) {
            errorLogger(
                error,
                "CreateBookmarkCollection.Services > createBookmarkCollection: Error creating bookmark collection",
                auth().currentUser
            )
        }
    }

    // #region loadCoverImage
    async function loadCoverImage (postId) {
        try {
            const postDoc = await firestore()
                .collection(FirestoreCollections.POSTS)
                .doc(postId)
                .get();

            if (!postDoc.exists) {
                return;    
            }

            const postData = postDoc.data() as TPosts;
            if (
                postData &&
                postData.imageUris &&
                postData.imageUris.length > 0
            ) {
                setCoverImageUrl(postData.imageUris[0]);
            }
        } catch (error) {
            console.error("Error fetching cover image:", error);
        }
    };

    // #region USE EFFECTS
    useEffect(() => {
        if (selectedPostIds && selectedPostIds.length > 0) {
            const firstPostId = selectedPostIds[0];
            loadCoverImage(firstPostId);
        }
    }, []);

    // #region RETURN
    return {
        coverImageUrl,
        collectionName,
        formik,
        i18n,
        navigation,
        setCollectionName
    }
}
