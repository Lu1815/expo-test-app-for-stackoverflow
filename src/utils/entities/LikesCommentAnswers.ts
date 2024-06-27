export type TLikesCommentAnswers = {
    answerId: string;
    userId: string;
    createdAt: string;
}

export type TLikesCommentAnswersSnapshot = {
    id: string;
    data: TLikesCommentAnswers;
}