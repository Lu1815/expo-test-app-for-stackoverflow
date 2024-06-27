export type TPostVM = {
    postId: string;
    userName: string;
    postImageUrls: string[];
    location?: string;
    locationDetails?: {
        latitude: number;
        longitude: number;
    }
    tags?: string[];
    caption?: string;
    likes: number;
    comments: number;
    shares: number;
    profilePictureUri?: string;
}


export function isTPostVM(data: any): data is TPostVM {
    const isString = (value: any): value is string => typeof value === 'string';
    const isNumber = (value: any): value is number => typeof value === 'number';
    const isStringArray = (value: any): value is string[] => Array.isArray(value) && value.every(isString);
    const isLocationDetails = (value: any): value is { latitude: number; longitude: number; } =>
        value === undefined || (isNumber(value.latitude) && isNumber(value.longitude));
    
    return (
        data &&
        isString(data.postId) &&
        isString(data.userName) &&
        isStringArray(data.postImageUrls) &&
        (isString(data.location) || data.location === undefined) &&
        isLocationDetails(data.locationDetails) &&
        (isStringArray(data.tags) || data.tags === undefined) &&
        (isString(data.caption) || data.caption === undefined) &&
        isNumber(data.likes) &&
        isNumber(data.comments) &&
        isNumber(data.shares) &&
        (isString(data.profilePictureUri) || data.profilePictureUri === undefined)
    );
}