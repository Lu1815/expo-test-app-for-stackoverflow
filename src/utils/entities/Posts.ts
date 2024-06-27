export type TPosts = {
    userId?: string;
    imageUris?: string[];
    createdAt?: string;
    createdAtTimestamp?: number; // NUMBER = TIMESTAMP IS USED HERE TO KEEP A BETTER TIME TRACK EVEN BETWEN TIME ZONES
    updatedAt?: string;
    updatedAtTimestamp?: number;
    likesCount?: number;
    commentsCount?: number;
    sharesCount?: number;
    isDeleted?: boolean;
    deletedReason?: string;
    deletedAt?: string;
    deletedAtTimestamp?: number;
    deletedBy?: string;

    // REQUIRED FIELDS WHEN ADDING OR UPDATING A POST
    caption: string | null;
    tags: string[] | null;
    location: string | null;
    locationDetails: {
        latitude: number;
        longitude: number;
    };
    isPrivate: boolean;
    searchKeywords: string[];
}

export type TPostSnapshot = {
    id: string;
    data: TPosts;
}