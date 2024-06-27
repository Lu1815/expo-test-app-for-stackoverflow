export type TCommentAnswers = {
    commentId: string;
    userId: string;
    content: string;
    likesCount: number;
    createdAt: string;
    createdAtTimestamp: number;
}

export type TCommentSnapshot = {
    id: string;
    data: TCommentAnswers;
}