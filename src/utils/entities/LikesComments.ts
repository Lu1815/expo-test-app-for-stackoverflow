export type TLikesComments = {
    commentId: string;
    userId: string;
    createdAt: string;
}

export type TLikesCommentsSnapshot = {
    id: string;
    data: TLikesComments;
}