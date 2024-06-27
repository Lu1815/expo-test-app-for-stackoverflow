import React from "react";
import { PostForm } from "../../../components/postForm/PostForm";
import useScreenTimeTracker from "../../../utils/hooks/UseScreenTimeTracker";
import { ScreenNamesEnum } from "../../../utils/lib/Consts";

export const Add = () => {
  useScreenTimeTracker(ScreenNamesEnum.ADD_POST);

  return (
    <>
      <PostForm />
    </>
  );
};
