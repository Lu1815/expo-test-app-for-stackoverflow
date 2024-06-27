import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { TPostSnapshot } from "../../../functions/src/entities";
import { TPosts, TUserDetails } from "../entities";
import { TPostVM } from "../viewModels/PostVM";

/*
* Transforms a document to a post view model
* @param document: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | TPostSnapshot | string
* @param userData: TUserDetails
* @param postData: TPosts
* @returns TPostVM
*/
export function transformToPostVM(
    document: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | TPostSnapshot | string, 
    userData: TUserDetails, 
    postData: TPosts
): TPostVM {
    const documentId = 
        typeof document === "string" 
        ? document 
        : document.id

    return {
        postId: documentId,
        userName: userData.userName,
        postImageUrls: postData.imageUris,
        location: postData.location,
        locationDetails: postData.locationDetails,
        tags: postData.tags,
        caption: postData.caption,
        likes: postData.likesCount,
        comments: postData.commentsCount,
        shares: postData.sharesCount,
        profilePictureUri: userData.picture ? userData.picture : undefined,
    };
};