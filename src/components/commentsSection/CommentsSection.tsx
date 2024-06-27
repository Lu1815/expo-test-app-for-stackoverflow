import { BottomSheetFlatList, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { TCommentVM } from "../../utils/viewModels/CommentVM";
import { Button } from "../button/Button";
import { Comment } from "../comment/Comment";
import { _commentssectionService } from "./CommentsSection.Services";
import { commentsSectionStyles } from "./CommentsSection.Styles";
import CommentsSectionSkeleton from "./CommentsSectionSkeleton";

type TCommentsProps = {
  postId: string;
};

export const CommentsSection: React.FC<TCommentsProps> = ({ postId }) => {
  const {
    comments,
    setComments,
    loading,
    loadMoreComments,
    i18n,
    formik,
    isCommentAnswer,
    setIsCommentAnswer,
    setCommentId
  } = _commentssectionService({ postId });
  const { handleBlur, handleChange, handleSubmit, values, touched, errors } =
    formik;

  const renderComment = useCallback(
    ({ item: comment }: { item: TCommentVM }) => (
      <Comment
        comment={comment}
        postId={postId}
        setCommentsList={setComments}
        key={comment.commentId}
        formik={formik}
        setIsCommentAnswer={setIsCommentAnswer}
        setCommentId={setCommentId}
      />
    ),
    [comments]
  );

  return (
    <View style={[commentsSectionStyles.container]}>
      <View style={{ flex: 1 }}>
        {loading && comments.length > 1 ? (
          <BottomSheetFlatList
            data={[0, 1, 2, 3, 4]}
            renderItem={() => <CommentsSectionSkeleton />}
            keyExtractor={(item) => item.toString()}
          />
        ) : (
          <BottomSheetFlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.commentId}
            ListEmptyComponent={
              <Text style={commentsSectionStyles.noCommentsText}>
                {i18n.t("commentSectionNoCommentsText")}
              </Text>
            }
            contentContainerStyle={commentsSectionStyles.flatList}
            onEndReached={loadMoreComments}
            nestedScrollEnabled
          />
        )}
      </View>
      <View style={commentsSectionStyles.inputContainer}>
        <BottomSheetTextInput 
          style={[
            commentsSectionStyles.input,
            !errors.comment && { marginBottom: 10 },
          ]} 
          onChangeText={handleChange("comment")}
          onBlur={handleBlur("comment")}
          value={values.comment}
          placeholder={i18n.t("commentSectionPlaceholderText")}
        />
        {touched.comment && errors.comment && (
          <Text style={commentsSectionStyles.errorText}>{errors.comment}</Text>
        )}
        <Button
          onPress={handleSubmit}
          text={i18n.t("commentSectionButtonText")}
          styles={commentsSectionStyles.submitButton}
        />
      </View>
    </View>
  );
};
