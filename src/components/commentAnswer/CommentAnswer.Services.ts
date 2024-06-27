import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useI18n } from '../../utils/contexts/i18nContext';
import { TCommentAnswers } from '../../utils/entities/CommentAnswers';
import { TLikesCommentAnswers } from '../../utils/entities/LikesCommentAnswers';
import { TUserDetails } from '../../utils/entities/UserDetails';
import { FirestoreCollections } from '../../utils/lib/Consts';
import { timeSince } from '../../utils/lib/DateFormats';
import { infoToast } from '../../utils/lib/Toasts';
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';
import { checkIfDocumentBelongsToCurrentUser } from '../../utils/lib/firestore/checkIfDocumentBelongsToCurrentUser';
import { fetchUserDetails } from '../../utils/lib/firestore/fetchUserDetails';
import { TCommentAnswerVM } from '../../utils/viewModels/CommentAnswerVM';

type TCommentAnswerProps = {
    answerId?: string;
    commentId?: string;
    setCommentAnswersList?: any;
}

export const _commentAnswerService = ({ answerId, commentId, setCommentAnswersList }: TCommentAnswerProps) => { 
    // EXTERNAL STATES
    const { i18n } = useI18n();

    // LOCAL STATES
    const [commentAnswerDetails, setCommentAnswerDetails] = useState<TCommentAnswerVM>(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [likeIconColor, setLikeIconColor] = useState("grey");
    const [likeIconName, setLikeIconName] = useState("heart-outline");
    const [isCommentFromCurrentUser, setIsCommentFromCurrentUser] = useState(false);

    // FUNCTIONS
    async function deleteCommentAnswer(answerId: string) {
        try {
            // DELETE THE COMMENT ANSWER
            await firestore().collection(FirestoreCollections.COMMENT_ANSWERS).doc(answerId).delete();
            setDeleteModalVisible(false);

            // REMOVE THE COMMENT FROM THE COMMENTS LIST IN THE COMMENTS SECTION COMPONENT
            setCommentAnswersList((prevComments) => prevComments.filter((comment) => comment.answerId !== answerId));
        } catch (error) {
            errorLogger(
                error,
                "Error deleting the comment answer > _commentAnswerService.deleteCommentAnswer function.",
                auth().currentUser
            )

            setDeleteModalVisible(false);
            console.log(`Error deleting the comment: ${error}`)
            infoToast("Error deleting the comment answer. Please try again.")
        }
    }

    async function getCommentAnswerDetails(answerId: string) {
        try {
            // FETCH COMMENT DETAILS
            const commentAnswerRef = firestore().doc(`${FirestoreCollections.LIKES_COMMENT_ANSWERS}/${answerId}_${auth().currentUser.uid}`)

            const commentAnswerSnap = await commentAnswerRef.get();

            if (!commentAnswerSnap.exists) { // THE COMMENT ANSWER HAS NOT BEEN LIKED BY THE USER YET
                setCommentAnswerDetails(null);
                return;
            }

            const commentData = commentAnswerSnap.data() as TCommentAnswers;

            const userData: TUserDetails = await fetchUserDetails(commentData.userId);
            const commentVM: TCommentAnswerVM = {
                answerId: commentAnswerSnap.id,
                commentId,
                userName: userData.userName,
                text: commentData.content,
                likes: commentData.likesCount,
                time: timeSince(commentData.createdAt),
                userProfileImage: userData.picture
            }

            setCommentAnswerDetails(commentVM);
            setLikeIconColor("red");
            setLikeIconName("cards-heart");
        } catch (error) {
            errorLogger(
                error,
                "Error fetching comment answer details > _commentAnswerService.getCommentAnswerDetails function.",
                auth().currentUser
            )

            infoToast("Error fetching comment answer details. Please try again.")
        }
    }

    function handleReplyToCommentPress(
        commentAnswer: TCommentAnswerVM, 
        setIsCommentAnswer: Dispatch<SetStateAction<boolean>>, 
        setCommentId: Dispatch<SetStateAction<string>>,
        formik: any,
    ) {
        if (formik) {
            formik.setFieldValue("comment", `@${commentAnswer.userName} `);
            setCommentId(commentAnswer.commentId);
        }

        if (setIsCommentAnswer) {
            setIsCommentAnswer(true);
        }
    }

    async function likeCommentAnswer(answerId: string) {
        if (likeIconColor === "red") {
            unlikeComment(answerId);
            return
        };

        setLikeIconColor("red");
        setLikeIconName("cards-heart");

        try {
            // ADD A LIKE TO THE COMMENT
            const commentAnswerRef = firestore()
                .collection(FirestoreCollections.COMMENT_ANSWERS)
                .doc(answerId);

            await commentAnswerRef.update({
                likesCount: firestore.FieldValue.increment(1)
            });

            const likesCommentAnswerRef = firestore().doc(`${FirestoreCollections.LIKES_COMMENT_ANSWERS}/${answerId}_${auth().currentUser.uid}`);

            const newLikesCommentAnswer: TLikesCommentAnswers = {
                answerId,
                userId: auth().currentUser.uid,
                createdAt: new Date().toISOString(),
            }

            await likesCommentAnswerRef.set(newLikesCommentAnswer);
        } catch (error) {
            errorLogger(
                error,
                "Error liking the comment answer > _commentAnswerService.likeCommentAnswer function.",
                auth().currentUser
            )

            setLikeIconColor("grey");
            setLikeIconName("heart-outline");
            infoToast("Error liking the comment answer. Please try again.")
        }
    }

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
            setCommentAnswersList((prevComments) => [newCommentAnswer, ...prevComments]);
        } catch (error) {
            errorLogger(
                error,
                "Error posting the comment answer > _commentAnswerService.postCommentAnswer function.",
                auth().currentUser
            )

            infoToast("Error posting the comment answer. Please try again.")
        }
    }

    async function unlikeComment(answerId: string) {
        setLikeIconColor("grey");
        setLikeIconName("heart-outline");

        try {
            // REMOVES A LIKE TO THE COMMENT
            const commentRef = firestore()
                .collection(FirestoreCollections.COMMENT_ANSWERS)
                .doc(answerId);

            await commentRef.update({
                likesCount: firestore.FieldValue.increment(-1)
            });
            await firestore().doc(`${FirestoreCollections.LIKES_COMMENT_ANSWERS}/${answerId}_${auth().currentUser.uid}`).delete();
        } catch (error) {
            errorLogger(
                error,
                "Error unliking the comment > _commentAnswerService.unlikeComment function.",
                auth().currentUser
            )

            setLikeIconColor("red");
            setLikeIconName("cards-heart");
            infoToast("Error unliking the comment. Please try again.")
        }
    }

    useEffect(() => {
        getCommentAnswerDetails(answerId);
    }, []);

    useEffect(() => {
        if (!answerId) return;

        const commentRef = firestore().collection(FirestoreCollections.COMMENT_ANSWERS).doc(answerId);

        const unsubscribe = commentRef.onSnapshot(async (docSnap) => {
            if (docSnap.exists) {
                try {
                    const commentData: TCommentAnswers = docSnap.data() as TCommentAnswers;
                    const userData: TUserDetails = await fetchUserDetails(commentData.userId);
                    const commentVM: TCommentAnswerVM = {
                        answerId: docSnap.id,
                        commentId: commentId,
                        userName: userData.userName,
                        text: commentData.content,
                        likes: commentData.likesCount,
                        time: timeSince(commentData.createdAt)
                    }
                    setCommentAnswerDetails(commentVM);
                } catch (error) {
                    errorLogger(
                        error,
                        "Error fetching comment answer details > _commentAnswerService.useEffect function.",
                        auth().currentUser
                    )

                    infoToast("Error fetching comment answer details. Please try again.")
                }
            }
        });

        return () => unsubscribe();  // Make sure to unsubscribe on component unmount
    }, [answerId]);

    useEffect(() => {
        const checkOwnership = async () => {
            const isFromCurrentUser = await checkIfDocumentBelongsToCurrentUser<TCommentAnswers>(
                FirestoreCollections.COMMENT_ANSWERS,
                answerId,
                auth().currentUser
            );
            setIsCommentFromCurrentUser(isFromCurrentUser);
        };

        checkOwnership();
    }, [answerId, auth().currentUser]);


    return {
        commentAnswerDetails,
        isDeleteModalVisible,
        setDeleteModalVisible,
        likeIconColor,
        likeIconName,
        isCommentFromCurrentUser,
        i18n,
        deleteCommentAnswer,
        likeCommentAnswer,
        postCommentAnswer,
        handleReplyToCommentPress,
    } 
}
