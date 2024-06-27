export type TComments = {
    postId: string;
    userId: string;
    content: string;
    likesCount: number;
    createdAt: string;
    createdAtTimestamp: number;
};

export type TCommentsSnapshot = {
    id: string;
    data: TComments;
}