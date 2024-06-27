export type TLikesPosts = {
    postId: string;
    userId: string;
    createdAt: string;
}

export type TLikesPostsSnapshot = {
    id: string;
    data: TLikesPosts;
}