import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from "@react-navigation/native";
import { useFormik } from 'formik';
import { useCallback, useMemo, useState } from "react";
import * as Yup from "yup";
import { useI18n } from '../../utils/contexts/i18nContext';
import { TCommentAnswers } from '../../utils/entities/CommentAnswers';
import { TComments } from "../../utils/entities/Comments";
import { TPosts } from "../../utils/entities/Posts";
import { TUserDetails } from "../../utils/entities/UserDetails";
import { FirestoreCollections } from "../../utils/lib/Consts";
import { timeSince } from "../../utils/lib/DateFormats";
import { infoToast } from "../../utils/lib/Toasts";
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../utils/lib/firestore/fetchUserDetails';
import { TCommentVM } from "../../utils/viewModels/CommentVM";

const validationSchema = Yup.object().shape({
    comment: Yup.string().required("The comment content is required")
});

type TCommentsSectionServiceProps = {
    postId: string;
}

export const _commentssectionService = ({ postId }: TCommentsSectionServiceProps) => {
    // EXTERNAL STATES
    const { i18n } = useI18n();

    // LOCAL STATUSES
    const [comments, setComments] = useState<TCommentVM[]>([])
    const [commentId, setCommentId] = useState<string>("");
    const [hasMore, setHasMore] = useState(true);
    const [isCommentAnswer, setIsCommentAnswer] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [likeIconColor, setLikeIconColor] = useState("grey");
    const [likeIconName, setLikeIconName] = useState("heart-outline");
    const [loading, setLoading] = useState(false)
    const COMMENTS_PER_PAGE = 30;

    const formik = useFormik({
        initialValues: {
            comment: ""
        },
        validationSchema: useMemo(() => validationSchema, []),
        onSubmit: (values) => {
            if (isCommentAnswer) {
                postCommentAnswer(values.comment, commentId);
                formik.resetForm();
                setIsCommentAnswer(false);
                return;
            }

            handleOptimisticCommentSubmit(values.comment);
            formik.resetForm();
        }
    })

    // FUNCTIONS
    const handleOptimisticCommentSubmit = async (comment: string) => {
        // Optimistically update UI
        const currentUser = auth().currentUser;
        const userDataSnapshot = await firestore()
            .collection(FirestoreCollections.USER_DETAILS)
            .doc(currentUser.uid)
            .get();
        const userData = userDataSnapshot.data() as TUserDetails;

        const tempComment: TCommentVM = {
            commentId: `temp-${Math.random().toString(36).substring(2, 9)}`,
            userName: userData.userName,
            text: comment,
            likes: 0,
            time: "Just now",
            userProfileImage: userData.picture
        };
        setComments([tempComment, ...comments]);

        console.log(`Comments state: ${JSON.stringify([tempComment, ...comments], null, 2)}`)
        try {
            await commentPost(comment, [tempComment, ...comments]);
        } catch (error) {
            // Revert optimistic update on error
            setComments(comments.filter(c => c.commentId !== tempComment.commentId));
        }
    };

    async function postCommentAnswer(answer: string, commentId: string) {
        try {
            // ADD AN ANSWER TO THE COMMENT BY INSERTING A NEW DOCUMENT IN THE commentAnswers COLLECTION
            const commentAnswerRef = firestore().collection(FirestoreCollections.COMMENT_ANSWERS).doc();
            const newCommentAnswer: TCommentAnswers = {
                content: answer,
                userId: auth().currentUser.uid,
                likesCount: 0,
                createdAt: new Date().toISOString(),
                createdAtTimestamp: firestore.Timestamp.now().toMillis(),
                commentId
            }

            await commentAnswerRef.set(newCommentAnswer);
        } catch (error) {
            errorLogger(
                error,
                "Error posting the comment answer > _commentssectionService.postCommentAnswer function.",
                auth().currentUser
            )

            infoToast("Error posting the comment answer. Please try again.")
        }
    }

    async function commentPost(comment: string, commentsList?: TCommentVM[]) {
        try {
            // ADD COMMENT TO THE POST BY INSERTING A NEW DOCUMENT IN THE comments COLLECTION
            const newEntity: TComments = {
                postId,
                userId: auth().currentUser.uid,
                content: comment,
                likesCount: 0,
                createdAt: new Date().toISOString(),
                createdAtTimestamp: firestore.Timestamp.now().toMillis()
            };

            const commentData = await firestore()
                .collection(FirestoreCollections.COMMENTS)
                .add(newEntity);

            await updateCommentsCount();

            if(!commentsList) return;

            const newCommentsState: TCommentVM[] = commentsList.map((c) => {
                if (c.commentId.includes("temp")) {
                    return {
                        ...c,
                        commentId: commentData.id
                    }
                }
                return c;
            });

            console.log(`New comments state: ${JSON.stringify(newCommentsState, null, 2)}`);
            setComments(newCommentsState);
        } catch (error) {
            errorLogger(
                error,
                "Error commenting the post > _commentssectionService.commentPost function.",
                auth().currentUser
            )

            infoToast("Error commenting the post. Please try again.")
        }
    }

    async function fetchPostComments() {
        setLoading(true);

        try {
            // FETCH COMMENTS OF THE POST
            const querySnapshot = await firestore()
                .collection(FirestoreCollections.COMMENTS)
                .where("postId", "==", postId)
                .orderBy("createdAtTimestamp", "desc")
                .orderBy("likesCount", "desc")
                .limit(COMMENTS_PER_PAGE)
                .get();

            if (querySnapshot.empty) return;

            const fetchCommentDetailsPromises = querySnapshot.docs.map(async (document) => {
                const commentData: TComments = document.data() as TComments;
                const userData: TUserDetails = await fetchUserDetails(commentData.userId);

                const comments: TCommentVM = {
                    commentId: document.id,
                    userName: userData.userName,
                    text: commentData.content,
                    likes: commentData.likesCount,
                    time: timeSince(commentData.createdAt),
                    userProfileImage: userData.picture
                }

                return comments;
            });

            const comments: TCommentVM[] = await Promise.all(fetchCommentDetailsPromises);

            const lastVisibleComment = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastVisibleComment);
            setHasMore(querySnapshot.docs.length === COMMENTS_PER_PAGE);
            setComments(comments)
        } catch (error) {
            errorLogger(
                error,
                "Error fetching comments > _commentssectionService.fetchPostComments function.",
                auth().currentUser
            )

            infoToast("Error fetching comments. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    function loadMoreComments() {
        if (!loading && hasMore) {
            fetchPostComments();
        }
    };

    async function updateCommentsCount(incrementCount: boolean = true) {
        const docReference = firestore().collection(FirestoreCollections.POSTS).doc(postId);
        const postData = (await docReference.get()).data() as TPosts;
        const commentsCount: number = postData.commentsCount;
        const newCommentsCount = incrementCount ? commentsCount + 1 : commentsCount - 1;
        await docReference.update({
            commentsCount: newCommentsCount,
        });
    }

    useFocusEffect(
        useCallback(() => {
            fetchPostComments();
        }, [])
    );

    // useEffect(() => {
    //     const commentsRef = firestore().collection(FirestoreCollections.COMMENTS);

    //     const unsubscribe = commentsRef.onSnapshot((snapshot) => {
    //         if (snapshot) {
    //             fetchPostComments();
    //         }
    //     });

    //     return () => unsubscribe();
    // }, []);

    return {
        comments,
        setComments,
        loading,
        loadMoreComments,
        i18n,
        formik,
        isCommentAnswer,
        setIsCommentAnswer,
        setCommentId
    }
}
