export type TFollows = {
    followerId: string;
    followingId: string;
    followedAt: Date;
    followedAtTimestamp: number;
}

export type TFollowsSnapshot = {
    id: string;
    data: TFollows;
}