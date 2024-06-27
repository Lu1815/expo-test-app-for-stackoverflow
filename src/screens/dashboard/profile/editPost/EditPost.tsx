
import React from 'react';
import { PostForm } from '../../../../components/postForm/PostForm';

export const EditPost = ({ route }) => {
  const { postId } = route.params || {};

   return (
    <>
      <PostForm isForEditing postId={postId}/>
    </>
   );
}
