import React, { Dispatch, SetStateAction } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TCommentAnswerVM } from "../../utils/viewModels/CommentAnswerVM";
import { commentStyles } from "../comment/Comment.Styles";
import { ModalDialog } from "../modalDialog/ModalDialog";
import { _commentAnswerService } from "./CommentAnswer.Services";

type TCommentProps = {
  answer?: TCommentAnswerVM;
  commentId?: string;
  setCommentAnswersList?: any;
  formik?: any;
  setIsCommentAnswer?: Dispatch<SetStateAction<boolean>>;
  setCommentId?: Dispatch<SetStateAction<string>>;
};

export const CommentAnswer = ({
  answer,
  commentId,
  setCommentAnswersList,
  formik,
  setIsCommentAnswer,
  setCommentId,
}: TCommentProps) => {
  const {
    isCommentFromCurrentUser,
    likeCommentAnswer,
    likeIconColor,
    likeIconName,
    commentAnswerDetails,
    deleteCommentAnswer,
    isDeleteModalVisible,
    setDeleteModalVisible,
    i18n,
    handleReplyToCommentPress,
  } = _commentAnswerService({
    answerId: answer.answerId,
    commentId,
    setCommentAnswersList,
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
                answer.userProfileImage
                  ? { uri: answer.userProfileImage }
                  : require("../../../assets/atardecer_dos.png")
              }
            />
          </View>

          {/* COMMENT CONTENT */}
          <View style={commentStyles.commentInfoContainer}>
            <View>
              <View style={commentStyles.comment}>
                <Text style={commentStyles.username}>
                  {answer.userName}
                  <Text
                    style={commentStyles.commentText}
                  >{` ${answer.text}`}</Text>
                </Text>

                <TouchableOpacity
                  onPress={() => likeCommentAnswer(answer.answerId)}
                  style={commentStyles.likeButton}
                >
                  <MCIcon name={likeIconName} size={20} color={likeIconColor} />
                </TouchableOpacity>
              </View>
            </View>

            {/* COMMENT INFO/OPTIONS */}
            <View style={commentStyles.comment}>
              <Text style={commentStyles.commentInfo}>
                {commentAnswerDetails ? commentAnswerDetails.time : answer.time}{" "}
                -{" "}
                {commentAnswerDetails
                  ? commentAnswerDetails.likes
                  : answer.likes}{" "}
                {i18n.t("commentSectionLikeText")}
              </Text>
              <TouchableOpacity
                onPress={() => handleReplyToCommentPress(answer, setIsCommentAnswer, setCommentId, formik)}
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

      {/* COMMENT ANSWERS */}

      <ModalDialog
        modalText="Do you want to delete this answer?"
        handleDeleteConfirm={() => deleteCommentAnswer(answer.answerId)}
        isDeleteModalVisible={isDeleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
      />
    </TouchableOpacity>
  );
};
