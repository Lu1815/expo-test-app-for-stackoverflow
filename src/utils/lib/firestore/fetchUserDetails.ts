import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { TUserDetails } from '../../entities/UserDetails';
import { FirestoreCollections } from '../Consts';

/**
*   Fetches the user details from the Firestore database
*   @param {string} userId The user ID
* 
*   @returns {Promise<TUserDetails>} The user details
* 
*   @throws {Error} `No such user document!` If the user document does not exist
**/
export async function fetchUserDetails(userId: string) {
    const userRef = firestore().doc(`${FirestoreCollections.USER_DETAILS}/${userId}`);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
        return userSnap.data() as TUserDetails;
    } else {
        throw new Error("No such user document!");
    }
}

/**
 * Fetches the user details snapshot from the Firestore database, this snapshot contains the document ID 
 * and the user details in the data() method.
 * 
 * @param userEmail a string representing the user's email
 * 
 * @returns a Promise of a QueryDocumentSnapshot containing the user's details
 * 
 * @throws {Error} `No such user document!` If the user document does not exist
 */
export async function fetchUserSnapshotByEmail(userEmail: string): Promise<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> {
    const userRef = firestore().collection(FirestoreCollections.USER_DETAILS).where("userEmail", "==", userEmail);
    const userSnap = await userRef.get();

    if (userSnap.empty) {
        throw new Error("No such user document!");
    }

    return userSnap.docs[0];
}