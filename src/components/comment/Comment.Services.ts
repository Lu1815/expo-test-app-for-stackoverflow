import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useI18n } from "../../utils/contexts/i18nContext";
import { TCommentAnswers } from "../../utils/entities/CommentAnswers";
import { TComments } from "../../utils/entities/Comments";
import { TLikesComments } from "../../utils/entities/LikesComments";
import { TUserDetails } from "../../utils/entities/UserDetails";
import { FirestoreCollections } from "../../utils/lib/Consts";
import { timeSince } from "../../utils/lib/DateFormats";
import { infoToast } from "../../utils/lib/Toasts";
import { errorLogger } from "../../utils/lib/errors/ErrorLogger";
import { checkIfDocumentBelongsToCurrentUser } from "../../utils/lib/firestore/checkIfDocumentBelongsToCurrentUser";
import { fetchUserDetails } from "../../utils/lib/firestore/fetchUserDetails";
import { TCommentAnswerVM } from "../../utils/viewModels/CommentAnswerVM";
import { TCommentVM } from "../../utils/viewModels/CommentVM";

type TCommentServiceProps = {
    commentId?: string;
    postId?: string;
    setCommentsList?: any;
    formik?: any;
};

export const _commentService = ({ commentId, postId, setCommentsList, formik }: TCommentServiceProps) => {
    // EXTERNAL STATES
    const { i18n } = useI18n();

    // LOCAL STATES
    const [commentAnswers, setCommentAnswers] = useState<TCommentAnswerVM[]>([]);
    const [commentDetails, setCommentDetails] = useState<TCommentVM>(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [likeIconColor, setLikeIconColor] = useState("grey");
    const [likeIconName, setLikeIconName] = useState("heart-outline");
    const [isCommentFromCurrentUser, setIsCommentFromCurrentUser] = useState(false);
    const [showCommentAnswers, setShowCommentAnswers] = useState(false);

    // FUNCTIONS
    async function deleteComment(commentId: string) {
        try {
            // DELETE THE COMMENT
            await firestore().collection(FirestoreCollections.COMMENTS).doc(commentId).delete();
            setDeleteModalVisible(false);

            // REMOVE THE COMMENT FROM THE COMMENTS LIST IN THE COMMENTS SECTION COMPONENT
            setCommentsList((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));

            const postRef = firestore().collection(FirestoreCollections.POSTS).doc(postId);
            await postRef.update({
                commentsCount: firestore.FieldValue.increment(-1)
            });
        } catch (error) {
            setDeleteModalVisible(false);
            errorLogger(
                error,
                "Error deleting the comment > _commentService.deleteComment function",
                auth().currentUser
            );

            infoToast("Error deleting the comment. Please try again.")
        }
    }

    async function fetchCommentAnswers() {
        // FETCH COMMENT ANSWERS
        const commentAnswerRef = firestore()
            .collection(FirestoreCollections.COMMENT_ANSWERS)
            .where("commentId", "==", commentId)
            .orderBy("createdAt", "asc");
        const commentAnswerSnap = await commentAnswerRef.get();

        const commentAnswersVMPromises = commentAnswerSnap.docs.map(async (document) => {
            const commentData: TCommentAnswers = document.data() as TCommentAnswers;
            const userData: TUserDetails = await fetchUserDetails(commentData.userId);
            const commentAnswersVM: TCommentAnswerVM = {
                answerId: document.id,
                commentId: commentData.commentId,
                likes: commentData.likesCount,
                text: commentData.content,
                time: timeSince(commentData.createdAt),
                userName: userData.userName,
                userProfileImage: userData.picture
            }

            return commentAnswersVM;
        });

        const commentAnswersVM: TCommentAnswerVM[] = await Promise.all(commentAnswersVMPromises);
        console.log(`commentAnswersVM: ${JSON.stringify(commentAnswersVM, null, 2)}`);

        setCommentAnswers(commentAnswersVM);
    }

    async function getCommentDetails(commentId: string) {
        try {
            // FETCH COMMENT DETAILS
            const commentRef = firestore().doc(`${FirestoreCollections.LIKES_COMMENTS}/${commentId}_${auth().currentUser.uid}`)

            const commentSnap = await commentRef.get();

            if (!commentSnap.exists) { // THE COMMENT HAS NOT BEEN LIKED BY THE USER YET
                setCommentDetails(null);
                return;
            }

            const commentData: TComments = commentSnap.data() as TComments;

            const userData: TUserDetails = await fetchUserDetails(commentData.userId);
            const commentVM: TCommentVM = {
                commentId: commentSnap.id,
                userName: userData.userName,
                text: commentData.content,
                likes: commentData.likesCount,
                time: timeSince(commentData.createdAt),
                userProfileImage: userData.picture
            }

            setCommentDetails(commentVM);
            setLikeIconColor("red");
            setLikeIconName("cards-heart");
        } catch (error) {
            errorLogger(
                error,
                "Error fetching comment details > _commentService.getCommentDetails function",
                auth().currentUser
            )

            infoToast("Error fetching comment details. Please try again.")
        }
    }

    function handleReplyToCommentPress(
        comment: TCommentVM,
        setIsCommentAnswer: Dispatch<SetStateAction<boolean>>,
        setCommentId: Dispatch<SetStateAction<string>>
    ) {
        if (formik) {
            formik.setFieldValue("comment", `@${comment.userName} `);
            setCommentId(comment.commentId);
        }

        if (setIsCommentAnswer) {
            setIsCommentAnswer(true);
        }
    }

    async function likeComment(commentId: string) {
        if (likeIconColor === "red") {
            unlikeComment(commentId);
            return
        };

        setLikeIconColor("red");
        setLikeIconName("cards-heart");

        try {
            // ADD A LIKE TO THE COMMENT
            const commentRef = firestore()
                .collection(FirestoreCollections.COMMENTS)
                .doc(commentId);

            await commentRef.update({
                likesCount: firestore.FieldValue.increment(1)
            });

            const likesCommentRef = firestore().doc(`${FirestoreCollections.LIKES_COMMENTS}/${commentId}_${auth().currentUser.uid}`);

            const newLikesComment: TLikesComments = {
                commentId,
                userId: auth().currentUser.uid,
                createdAt: new Date().toISOString()
            }

            await likesCommentRef.set(newLikesComment);
        } catch (error) {
            errorLogger(
                error,
                "Error liking the comment > _commentService.likeComment function",
                auth().currentUser
            )

            setLikeIconColor("grey");
            setLikeIconName("heart-outline");

            infoToast("Error liking the comment. Please try again.")
        }
    }

    async function unlikeComment(commentId: string) {
        setLikeIconColor("grey");
        setLikeIconName("heart-outline");

        try {
            // REMOVE A LIKE TO THE COMMENT
            const commentRef = firestore()
                .collection(FirestoreCollections.COMMENTS)
                .doc(commentId);

            await commentRef.update({
                likesCount: firestore.FieldValue.increment(-1)
            });

            await firestore().doc(`${FirestoreCollections.LIKES_COMMENTS}/${commentId}_${auth().currentUser.uid}`).delete();
        } catch (error) {
            errorLogger(
                error,
                "Error unliking the comment > _commentService.unlikeComment function",
                auth().currentUser
            )

            setLikeIconColor("red");
            setLikeIconName("cards-heart");
            infoToast("Error unliking the comment. Please try again.")
        }
    }


    const handleShowCommentAnswers = async () => {
        await fetchCommentAnswers();
        setShowCommentAnswers(true);
    };

    const handleHideCommentAnswers = () => {
        setShowCommentAnswers(false);
    };

    useEffect(() => {
        getCommentDetails(commentId);
    }, []);

    useEffect(() => {
        if (!commentId) return;

        const documentRef = firestore().collection(FirestoreCollections.COMMENT_ANSWERS).where("commentId", "==", commentId);

        const unsubscribe = documentRef.onSnapshot(async (snapshot) => {
            if (snapshot) {
                snapshot.docs.forEach(async (doc) => {
                    try {
                        const commentAnswersVMPromises: Promise<TCommentAnswerVM>[] = snapshot.docs.map(async (document) => {
                            const commentAnswerDetails = document.data() as TCommentAnswers;
                            const userId = commentAnswerDetails.userId;
                            const userData = await fetchUserDetails(userId);
                            const commentData: TCommentAnswers = document.data() as TCommentAnswers;

                            return {
                                answerId: document.id,
                                commentId: commentData.commentId,
                                likes: commentData.likesCount,
                                text: commentData.content,
                                time: timeSince(commentData.createdAt),
                                userName: userData.userName,
                                userProfileImage: userData.picture
                            }
                        });

                        const commentAnswersVM: TCommentAnswerVM[] = await Promise.all(commentAnswersVMPromises);
                        setCommentAnswers(commentAnswersVM);
                    } catch (error) {
                        errorLogger(
                            error,
                            "Error fetching comment answers > _commentService.useEffect function",
                            auth().currentUser
                        )

                        infoToast("Error fetching comment answers. Please try again.")
                    }
                });
            }
        });

        return () => unsubscribe();  // Make sure to unsubscribe on component unmount
    }, [commentId]);

    useEffect(() => {
        if (!commentId) return;

        const commentRef = firestore().collection(FirestoreCollections.COMMENTS).doc(commentId);

        const unsubscribe = commentRef.onSnapshot(async (docSnap) => {
            if (docSnap.exists) {
                try {
                    const commentData: TComments = docSnap.data() as TComments;
                    const userData: TUserDetails = await fetchUserDetails(commentData.userId);
                    const commentVM: TCommentVM = {
                        commentId: docSnap.id,
                        userName: userData.userName,
                        text: commentData.content,
                        likes: commentData.likesCount,
                        time: timeSince(commentData.createdAt)
                    }
                    setCommentDetails(commentVM);
                } catch (error) {
                    errorLogger(
                        error,
                        "Error fetching comment details > _commentService.useEffect function",
                        auth().currentUser
                    )

                    infoToast("Error fetching comment details. Please try again.")
                }
            }
        });

        return () => unsubscribe();  // Make sure to unsubscribe on component unmount
    }, [commentId]);

    useEffect(() => {
        const checkOwnership = async () => {
            const isFromCurrentUser = await checkIfDocumentBelongsToCurrentUser<TComments>(
                FirestoreCollections.COMMENTS,
                commentId,
                auth().currentUser
            );
            setIsCommentFromCurrentUser(isFromCurrentUser);
        };

        checkOwnership();
    }, [commentId, auth().currentUser]);

    return {
        i18n,
        commentAnswers,
        setCommentAnswers,
        commentDetails,
        handleReplyToCommentPress,
        likeComment,
        likeIconColor,
        likeIconName,
        deleteComment,
        isDeleteModalVisible,
        setDeleteModalVisible,
        isCommentFromCurrentUser,
        showCommentAnswers,
        handleShowCommentAnswers,
        handleHideCommentAnswers,
    };
}
