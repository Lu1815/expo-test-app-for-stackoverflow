import { IOptionsVM } from "../viewModels/ReportsCategoriesVM";

export type TUserDetailsSnapshot = {
    id: string;
    data: TUserDetails;
}

export type TUserDetails = {
    userName: string;
    userEmail: string;
    description: string;
    phoneNumber: string;
    picture: string;
    isOtpLoginEnabled: boolean;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
    followersCount: number;
    followingsCount: number;
    postCount: number;
    searchKeywords: string[];
    devicesTokens?: string[];
    lastKnownLocationName?: string;
    lastKnownLocationDetails?: {
        latitude: number;
        longitude: number;
    };
    createdAt: string;
    createdAtTimestamp: number;
    
    isDisabled?: boolean;
    createdWithGoogle?: boolean;
    disabledReason?: string;
    disabledAt?: string;
    disabledAtTimestamp?: number;
    disabledBy?: string;
    isDeleted?: boolean;
    deletedReason?: string;
    deletedAt?: string;
    deletedAtTimestamp?: number;
    deletedBy?: string;
}

export interface IBookmarksCollections extends IOptionsVM {
    bookmarks?: IBookmarks[];
}

export interface IBookmarks {
    postId: string;
    postTitle: string;
    postAuthor: string;
    postThumbail: string;
}