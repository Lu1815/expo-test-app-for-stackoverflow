import React, { Dispatch, SetStateAction } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TCommentVM } from "../../utils/viewModels/CommentVM";
import { CommentAnswer } from "../commentAnswer/CommentAnswer";
import { ModalDialog } from "../modalDialog/ModalDialog";
import { _commentService } from "./Comment.Services";
import { commentStyles } from "./Comment.Styles";

type TCommentProps = {
  comment?: TCommentVM;
  postId?: string;
  formik?: any;
  setCommentsList?: Dispatch<SetStateAction<TCommentVM[]>>;
  setIsCommentAnswer?: Dispatch<SetStateAction<boolean>>;
  setCommentId?: Dispatch<SetStateAction<string>>;
};

export const Comment = ({
  comment,
  postId,
  formik,
  setCommentsList,
  setIsCommentAnswer,
  setCommentId,
}: TCommentProps) => {
  const {
    i18n,
    commentAnswers,
    setCommentAnswers,
    commentDetails,
    likeComment,
    likeIconColor,
    likeIconName,
    deleteComment,
    isDeleteModalVisible,
    setDeleteModalVisible,
    isCommentFromCurrentUser,
    handleReplyToCommentPress,
    showCommentAnswers,
    handleShowCommentAnswers,
    handleHideCommentAnswers,
  } = _commentService({
    commentId: comment.commentId,
    postId,
    setCommentsList,
    formik,
  });

  return (
    <TouchableOpacity
      onLongPress={() => {
        if (isCommentFromCurrentUser) {
          setDeleteModalVisible(true);
        }
      }}
    >
      <View style={commentStyles.commentContainer}>
        <View style={commentStyles.commentContentContainer}>
          {/* USER PROFILE IMAGE */}
          <View>
            <Image
              style={{ width: 30, height: 30, borderRadius: 100 }}
              source={
                comment.userProfileImage
                  ? { uri: comment.userProfileImage }
                  : require("../../../assets/atardecer_dos.png")
              }
            />
          </View>

          {/* COMMENT CONTENT */}
          <View style={commentStyles.commentInfoContainer}>
            <View>
              <View style={commentStyles.comment}>
                <Text style={commentStyles.username}>
                  {comment.userName}
                  <Text
                    style={commentStyles.commentText}
                  >{` ${comment.text}`}</Text>
                </Text>

                <TouchableOpacity
                  onPress={() => likeComment(comment.commentId)}
                  style={commentStyles.likeButton}
                >
                  <MCIcon name={likeIconName} size={20} color={likeIconColor} />
                </TouchableOpacity>
              </View>
            </View>

            {/* COMMENT INFO/OPTIONS */}
            <View style={commentStyles.comment}>
              <Text style={commentStyles.commentInfo}>
                {commentDetails ? commentDetails.time : comment.time} -{" "}
                {commentDetails ? commentDetails.likes : comment.likes}{" "}
                {i18n.t("commentSectionLikeText")}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleReplyToCommentPress(
                    comment,
                    setIsCommentAnswer,
                    setCommentId
                  )
                }
                style={commentStyles.replyButton}
              >
                <Text style={commentStyles.replyButtonText}>
                  {i18n.t("commentSectionReplyText")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* SHOW/HIDE COMMENT ANSWERS BUTTON */}
      {!showCommentAnswers && commentAnswers.length > 0 && (
        <TouchableOpacity
          onPress={handleShowCommentAnswers}
          style={commentStyles.showAnswersButton}
        >
          <Text style={commentStyles.showAnswersButtonText}>
            {i18n.t("showCommentAnswersText")}
          </Text>
        </TouchableOpacity>
      )}
      {showCommentAnswers && (
        <TouchableOpacity
          onPress={handleHideCommentAnswers}
          style={commentStyles.showAnswersButton}
        >
          <Text style={commentStyles.showAnswersButtonText}>
            {i18n.t("hideCommentAnswersText")}
          </Text>
        </TouchableOpacity>
      )}

      {/* COMMENT ANSWERS */}
      {showCommentAnswers && (
        <View style={{ marginLeft: 30 }}>
          {commentAnswers.map((answer) => (
            <CommentAnswer
              key={answer.answerId}
              answer={answer}
              commentId={comment.commentId}
              setCommentAnswersList={setCommentAnswers}
              formik={formik}
              setIsCommentAnswer={setIsCommentAnswer}
              setCommentId={setCommentId}
            />
          ))}
        </View>
      )}

      <ModalDialog
        modalText="Do you want to delete this comment?"
        handleDeleteConfirm={() => deleteComment(comment.commentId)}
        isDeleteModalVisible={isDeleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
      />
    </TouchableOpacity>
  );
};
