import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { errorToast } from '../Toasts';

type TWithUserId = {
    userId: string;
}

export async function checkIfDocumentBelongsToCurrentUser<T extends TWithUserId>(
    collectionName: string, 
    documentId: string, 
    currentUser: FirebaseAuthTypes.User
): Promise<boolean> {
    try {
        const documentRef = firestore().collection(collectionName).doc(documentId);
        const documentSnap = await documentRef.get();

        if (!documentSnap.exists) {
            return false;
        }

        const documentData: T = documentSnap.data() as T;

        if ("userId" in documentData) {
            return documentData.userId === currentUser.uid;
        }
    } catch (error) {
        console.log(`Error checking if the post belongs to the current user: ${error}`)
        errorToast("Error checking if the post belongs to the current user. Please try again.")
        return false;
    }
}