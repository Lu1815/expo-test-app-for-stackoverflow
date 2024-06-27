import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from "expo-image-picker";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { useAuth } from "../../../../utils/contexts/AuthContext";
import { useI18n } from '../../../../utils/contexts/i18nContext';
import { TUserDetails } from "../../../../utils/entities/UserDetails";
import { FirestoreCollections } from "../../../../utils/lib/Consts";
import { errorToast, infoToast } from "../../../../utils/lib/Toasts";
import { errorLogger } from '../../../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../../../utils/lib/firestore/fetchUserDetails';

const ProfileEditSchema = Yup.object().shape({
    username: Yup.string(),
    description: Yup.string().required('Required'),
    phoneNumber: Yup.string().required('Required'),
});

export const _profiledetailsService = () => {
    const { i18n } = useI18n();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const formik = useFormik({
        initialValues: { username: '', description: '', phoneNumber: '' },
        validationSchema: ProfileEditSchema,
        onSubmit: (values) => updateProfileDetails(values.username, values.description, values.phoneNumber),
    });

    async function checkIfNewValuesAreDifferent() {
        try {
            const userDetails: TUserDetails = await fetchUserDetails(currentUser.uid);

            return (
                formik.values.username === userDetails.userName
                && formik.values.description === userDetails.description
                && formik.values.phoneNumber === userDetails.phoneNumber
                && profileImage === userDetails.picture
            )
        } catch (error) {
            errorLogger(
                error,
                `Error during checking if user details are different from the updated values 
                > _profiledetailsService.fetchUserDetails function.`
            )
        }
    }

    async function getUserDetails() {
        setIsLoading(true);
        try {
            // Fetch user details
            const userDetails: TUserDetails = await fetchUserDetails(currentUser.uid);

            console.log("userDetails", JSON.stringify(userDetails, null, 2));

            setProfileImage(userDetails?.picture);
            formik.values.username = userDetails.userName;
            formik.values.description = userDetails.description;
            formik.values.phoneNumber = userDetails.phoneNumber;
        } catch (error) {
            errorLogger(
                error,
                "Error during fetching user details > _profiledetailsService.fetchUserDetails function."
            )
            errorToast(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function pickImage() {
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log("Profile image: ", result.assets[0].uri)
            setProfileImage(result.assets[0].uri);
        }
    };

    async function takePhoto() {
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    async function updateProfileDetails(
        userName: string,
        profileDescription: string,
        phoneNumber: string
    ) {
        setIsLoading(true);
        try {
            const userDetailsRef = firestore().collection(FirestoreCollections.USER_DETAILS).doc(currentUser?.uid);

            if (!profileImage) {
                await userDetailsRef.update({
                    userName,
                    description: profileDescription,
                    phoneNumber: phoneNumber,
                });
                infoToast(i18n.t("profileDetailsUpdatedInfoNotificationText"))
                return;
            }

            // URL of the image in the storage comes in the form of "gs://bucket-name/path/to/image.jpg?token=12345"
            const path = profileImage.substring(profileImage.lastIndexOf('/') + 1).split("?")[0];
            const imageReference = storage().ref(path);
            let downloadURL = null;

            imageReference.getDownloadURL().then((url) => {
                downloadURL = url;
            }).catch(() => {
                downloadURL = null;
            });

            const areDetailsDifferent = await checkIfNewValuesAreDifferent();
            let profileImageUrl = profileImage;

            if (downloadURL && downloadURL !== profileImageUrl) {
                imageReference.delete();
                profileImageUrl = await uploadImage();
            } else {
                profileImageUrl = await uploadImage();
            }

            if (areDetailsDifferent) {
                infoToast(i18n.t("profileDetailsNoChangesNotificationText"))
                return;
            }

            await userDetailsRef.update({
                userName,
                description: profileDescription,
                phoneNumber: phoneNumber,
                picture: profileImageUrl,
            });

            infoToast(i18n.t("profileDetailsUpdatedInfoNotificationText"))
        } catch (error) {
            errorLogger(
                error,
                "Error during updating user details > _profiledetailsService.updateProfileDetails function."
            )

            errorToast(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function uploadImage() {
        try {
            const fileName = profileImage.substring(profileImage.lastIndexOf('/') + 1);
            const reference = storage().ref(fileName);

            await reference.putFile(profileImage);
            const downloadURL = await reference.getDownloadURL();

            return downloadURL;
        } catch (err) {
            errorLogger(
                err,
                "Error uploading image > _postformService.uploadImage function.",
                currentUser
            )

            errorToast("Error", "There was an error uploading the image");
        }
    }

    useEffect(() => {
        getUserDetails();
    }, [])

    return { pickImage, takePhoto, profileImage, formik, i18n, isLoading }
}