
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
import { LocationGeocodedAddress } from "expo-location";
import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from 'react-native';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useI18n } from '../../utils/contexts/i18nContext';
import { TPostMentions } from '../../utils/entities/PostMentions';
import { TPosts } from '../../utils/entities/Posts';
import { TUserDetails } from '../../utils/entities/UserDetails';
import { useDebounce } from '../../utils/hooks/UseDebounce';
import { useNavigationGH } from '../../utils/hooks/UseNavigation';
import { FirestoreCollections, ScreenRoutes } from '../../utils/lib/Consts';
import { generateKeywords } from '../../utils/lib/GenerateKeywords';
import { errorToast, infoToast } from '../../utils/lib/Toasts';
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';
import { fetchUserDetails } from '../../utils/lib/firestore/fetchUserDetails';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_DEV_ANDROID_API_KEY;
const GOOGLE_PLACES_URI = process.env.EXPO_PUBLIC_DEV_GOOGLE_PLACES_URL;


interface ILatLong {
    latitude: number;
    longitude: number;
}
interface ICurrentLocationType extends ILatLong {
    city?: string,
    country?: string,
    district?: string,
    isoCountryCode?: string,
    name?: string,
    postalCode?: string,
    region?: string,
    street?: string,
    streetNumber?: string,
    subregion?: string,
    timezone?: string,
    formattedAddress?: string,
}

type TPostFormService = {
    postId: string;
}

export const _postformService = ({ postId }: TPostFormService) => {
    // #region EXTERNAL STATES
    const { i18n } = useI18n();
    const { currentUser } = useAuth();
    const { navigation } = useNavigationGH();

    // #region LOCAL STATES

    //* MEANT TO STORE THE FOLLOWING IDS IN ORDER TO AVOID FETCHING THEM EVERY TIME
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const followingIdsRef = useRef<string[]>([]);

    //* MEANT TO STORE THE USERS THAT THE USER FOLLOWS WHEN THE USER MENTIONS SOMEONE
    const mentionModalRef = useRef<BottomSheetModal>(null);
    const [followingUsers, setFollowingUsers] = useState<TUserDetails[]>([]);
    const [imageUriList, setImageUriList] = useState<string[]>([]);
    const [isGooglePlacesModalVisibile, setGooglePlacesModalVisibile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mention, setMention] = useState("");
    const [places, setPlaces] = useState([]);
    const tabBarHeight = useBottomTabBarHeight();
    const [street, setStreet] = useState<ICurrentLocationType>({
        city: undefined,
        country: undefined,
        district: undefined,
        isoCountryCode: undefined,
        name: undefined,
        postalCode: undefined,
        region: undefined,
        street: undefined,
        streetNumber: undefined,
        subregion: undefined,
        timezone: undefined,
        formattedAddress: undefined,
        latitude: 0,
        longitude: 0
    });
    const formik = useFormik({
        initialValues: {
            caption: "",
            tags: [],
            tagInputValue: "",
            location: "",
            locationDetails: {
                latitude: 0,
                longitude: 0
            },
            isPrivate: false,
        },
        onSubmit: (values, { setFieldValue }) => {
            if (postId) {
                updatePost({ ...values }, setFieldValue);
                return
            }

            uploadPost({ ...values }, setFieldValue);
        },
    });
    const debouncedSearchedPlace = useDebounce(formik.values.location, 500);
    const debouncedMention = useDebounce(mention, 500);

    // #region FUNCTIONS

    function createTags(text: string, setFieldValue: Function, values: any) {
        setFieldValue("tagInputValue", text);
        if (text.slice(-1) === " ") {
            // Check if the last character is a space
            const newTag = `#${text.trim()}`;
            if (newTag) {
                const newTags = [...values.tags, newTag];
                setFieldValue("tags", newTags); // Update tags in Formik
            }
            setFieldValue("tagInputValue", ""); // Clear input field
        }
    }

    // #region getPostDetails
    async function getPostDetails(): Promise<TPosts> {
        try {
            const postSnapshot = await firestore().collection(FirestoreCollections.POSTS).doc(postId).get();

            if (!postSnapshot.exists) {
                throw new Error("Post not found")
            }

            const post = postSnapshot.data() as TPosts;
            return post;
        } catch (error) {
            errorLogger(
                error,
                "Error fetching post details > _postformService.getPostDetails function.",
                currentUser
            )

            errorToast("Error fetching post", "There was an error fetching the post, please try again!");
        }
    }

    // #region fetchFollowingIds
    async function fetchFollowingIds () {
        try {
            const query = firestore().collection('follows')
                .where("followerId", "==", currentUser.uid);
            const snapshot = await query.get();
            const ids = snapshot.docs.map(doc => doc.data().followingId);

            console.log("Following IDs:", ids)

            setFollowingIds(ids);
            followingIdsRef.current = ids;
        } catch (error) {
            console.error("Error fetching following IDs:", error);
        }
    };

    // #region fetchFollowedUsersByUserInput
    async function fetchFollowedUsersByUserInput(text: string) {
        setLoading(true);
        try {
            if (followingIdsRef.current.length === 0) {
                console.log("No followers found or not yet loaded.");
                setFollowingUsers([]);
                return;
            }

            const userDetailsPromises = followingIdsRef.current.map(uid =>
                firestore().doc(`userDetails/${uid}`).get()
            );

            const userDetailsSnapshots = await Promise.all(userDetailsPromises);

            if (text.length === 0) {
                setFollowingUsers([]);
                return;
            }

            const userInfos: TUserDetails[] = userDetailsSnapshots
                .map(snapshot => snapshot.data() as TUserDetails)
                .filter((user: TUserDetails) =>
                    user.userName.toLowerCase().startsWith(text.toLowerCase())
                    || user.userEmail.toLocaleLowerCase().startsWith(text.toLowerCase())
                )
                .slice(0, 3) as TUserDetails[];

            if (userInfos.length === 0) {
                setFollowingUsers([]);
                return;
            }

            setFollowingUsers(userInfos);
        } catch (error) {
            errorLogger(
                error,
                "Error fetching followed users by user input > _postformService.fetchFollowedUsersByUserInput function.",
                currentUser
            )
            errorToast("Error fetching users", "There was an error fetching users, please try again later!");
        } finally {
            setLoading(false)
        }
    }

    // #region fetchPlaces
    async function fetchPlaces(inputText) {
        const GOOGLE_PLACES_QUERY = `?key=${GOOGLE_PLACES_API_KEY}&input=${inputText}`
        try {
            const apiUrl = `${GOOGLE_PLACES_URI}${GOOGLE_PLACES_QUERY}`;

            const result = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Allow-Control-Allow-Origin": "*",
                },
            });

            const json = await result.json();

            if (json.status === "ZERO_RESULTS") {
                setPlaces([]);
                return;
            }

            setPlaces(json.predictions);
        } catch (err) {
            errorLogger(
                err,
                "Error fetching places > _postformService.fetchPlaces function.",
                currentUser
            )

            errorToast("Error fetching places", "There was an error fetching places, please try again!");
        }

        // const places = placesPlaceholder.filter((place) => place.name.toLowerCase().includes(inputText.toLowerCase())).slice(0, 5);
        // setPlaces(places);
    };

    // #region fetchPostDetails
    async function fetchPostDetails() {
        try {
            const postSnapshot = await firestore().collection(FirestoreCollections.POSTS).doc(postId).get();

            if (!postSnapshot.exists) {
                throw new Error("Post not found")
            }

            const post = postSnapshot.data() as TPosts;

            formik.setValues({
                caption: post.caption,
                tags: post.tags,
                location: post.location,
                isPrivate: post.isPrivate ? post.isPrivate : false,
                locationDetails: post.locationDetails,
                tagInputValue: ""
            }, false);
            setImageUriList(post.imageUris)
        } catch (error) {
            errorLogger(
                error,
                "Error fetching post details > _postformService.fetchPostDetails function.",
                currentUser
            )

            errorToast("Error fetching post", "There was an error fetching the post, please try again!");
        }
    }

    // #region handleCaptionChange
    // ADDED THIS FUNCTION TO HANDLE THE MENTION MODAL VISIBILITY AND THE MENTION FUNCTIONALITY
    const handleCaptionChange = (inputText: string) => {
        formik.handleChange("caption")(inputText);

        if (inputText[inputText.length - 1] === "@") {
            mentionModalRef.current?.present();
        }
    };


    // #region handleFormikValuesChange
    function handleFormikValuesChange(values: any) {
        formik.setValues(values);
    }


    // #region handleLocationSelectorNavigate
    function handleLocationSelectorNavigate(){
        navigation.navigate(ScreenRoutes.ADD_FORM_LOCATION, {
            setValues: handleFormikValuesChange,
            values: formik.values
        });
    }

    // #region pickImage
    async function pickImage() {
        // No permissions request is necessary for launching the image library
        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUriList([result.assets[0].uri, ...imageUriList]);
        } else {
            alert('You did not select any image.');
        }
    };

    async function pickImages() {
        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setImageUriList(previous => [
                ...result.assets.map(asset => asset.uri),
                ...previous
            ]);
        } else {
            alert('You did not select any image.');
        }
    }

    // #region removeImage
    const removeImage = (index: number) => {
        const newList = [...imageUriList];
        newList.splice(index, 1);
        setImageUriList(newList);
    };

    // #region takePhoto
    async function takePhoto() {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        // No permissions request is necessary for launching the image library
        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUriList(previousValue => [result.assets[0].uri, ...previousValue]);
        } else {
            alert('You did not select any image.');
        }
    }

    async function requestPermissions() {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

        if (cameraPermission.status !== 'granted') {
            Alert.alert(
                'Camera permission required',
                'The app accesses your camera to let you take photos.',
                [{ text: 'OK' }]
            );
            return false;
        }

        return true;
    }

    async function takePhotos() {
        // No permissions request is necessary for launching the image library
        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUriList(previous => [result.assets[0].uri, ...previous]);
        } else {
            alert('You did not select any image.');
        }
    }

    // #region updatePost
    async function updatePost({ caption, tags, location, locationDetails, isPrivate }, setFieldValue: Function) {
        setLoading(true)

        if (!caption && tags.length === 0 && !location && imageUriList.length === 0) {
            infoToast("You cannot update a post with empty values", "Please fill at least one of the input fields to update your post!")
            setLoading(false)
            return
        };

        try {
            // ADD NEW POST
            const collectionReference = firestore().collection(FirestoreCollections.POSTS).doc(postId);
            const captionAndTags = tags.length !== 0
                ? `${caption} ${tags.join(" ").replace(/#/g, "")}`
                : caption;
            const searchKeywords: string[] = generateKeywords(captionAndTags);

            if (location) {
                const stringLocation: string = location;
                let locationParts: string[] = stringLocation.split(",");
                locationParts = locationParts.map((part) => part.trim());
                searchKeywords.push(...locationParts);
            }

            if (locationDetails) {
                if (locationDetails.latitude) {
                    searchKeywords.push(locationDetails.latitude.toString());
                }

                if (locationDetails.longitude) {
                    searchKeywords.push(locationDetails.longitude.toString());
                }
            }

            const updatedDocument: TPosts = {
                userId: currentUser.uid,
                caption: caption,
                location: location ? location : street.formattedAddress,
                locationDetails: locationDetails.latitude && locationDetails.longitude
                    ? locationDetails
                    : {
                        latitude: street.latitude,
                        longitude: street.longitude
                    },
                tags: tags,
                searchKeywords,
                isPrivate,
                updatedAt: new Date().toISOString(),
                updatedAtTimestamp: firestore.Timestamp.now().toMillis(),
            }
            await collectionReference.update(updatedDocument);

            infoToast(i18n.t("postFormPostUpdatedText"));
            navigation.goBack();
        } catch (error) {
            errorLogger(
                error,
                "Error updating post > _postformService.updatePost function.",
                currentUser
            )

            errorToast(error.message, "There was an error sharing your post, plase try again!");

            const post = await getPostDetails();
            setFieldValue("caption", post.caption);
            setFieldValue("tags", post.tags);
            setFieldValue("location", post.location);
        } finally {
            setLoading(false);
        }
    }

    // #region uploadImages
    async function uploadImages(): Promise<string[]> {
        try {
            const imageUrls = await Promise.all(
                imageUriList.map(async uri => {
                    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
                    const reference = storage().ref(fileName);
                    await reference.putFile(uri);
                    return await reference.getDownloadURL();
                })
            );

            return imageUrls;
        } catch (error) {
            errorLogger(
                error,
                "Error uploading images > _postformService.uploadImages function.",
                currentUser
            )

            errorToast("Error", "There was an error uploading the images");
        }
    }

    // #region uploadPost
    async function uploadPost({ caption, tags, location, locationDetails, isPrivate }, setFieldValue: Function) {
        setLoading(true)

        if (!caption && tags.length === 0 && !location && imageUriList.length === 0) {
            infoToast("You cannot share an empty post", "Please fill at least one of the input fields to share your post!")
            setLoading(false)
            return
        };

        try {
            // ADD NEW POST
            const mentions: string[] = caption.match(/@\w+/g);
            const imageUrls: string[] = await uploadImages();
            const collectionReference = firestore().collection(FirestoreCollections.POSTS);
            const captionAndTags = tags.length !== 0
                ? `${caption} ${tags.join(" ").replace(/#/g, "")}`
                : caption;
            const searchKeywords: string[] = generateKeywords(captionAndTags);

            if (location) {
                const stringLocation: string = location;
                let locationParts: string[] = stringLocation.split(",");
                locationParts = locationParts.map((part) => part.trim());
                searchKeywords.push(...locationParts);
            }

            if (locationDetails) {
                if (locationDetails.latitude) {
                    searchKeywords.push(locationDetails.latitude.toString());
                }

                if (locationDetails.longitude) {
                    searchKeywords.push(locationDetails.longitude.toString());
                }
            }

            if (currentUser) {
                const userDetails: TUserDetails = await fetchUserDetails(currentUser.uid);

                searchKeywords.push(
                    currentUser.email,
                    currentUser.email.split("@")[0],
                    userDetails.userName,
                );
            }

            const timestamp = firestore.Timestamp.now();
            const newDocument: TPosts = {
                commentsCount: 0,
                likesCount: 0,
                sharesCount: 0,
                createdAt: new Date(timestamp.toMillis()).toISOString(),
                createdAtTimestamp: timestamp.toMillis(),
                userId: currentUser.uid,
                caption: caption,
                imageUris: imageUrls,
                location: location ? location : street.formattedAddress,
                locationDetails: locationDetails.latitude && locationDetails.longitude
                    ? locationDetails
                    : {
                        latitude: street.latitude,
                        longitude: street.longitude
                    },
                tags: tags,
                searchKeywords,
                isPrivate
            }
            const postDocReference = await collectionReference.add(newDocument);

            // UPDATE USER POST COUNT
            const docReference = firestore().collection(FirestoreCollections.USER_DETAILS).doc(currentUser.uid);
            const postCount = (await docReference.get()).data().postCount;
            await docReference.update({
                postCount: postCount + 1,
            })

            if (mentions) {
                const userName = (await fetchUserDetails(currentUser.uid)).userName;

                const mentionsPromises = mentions.map(mention => {
                    const mentionedUserName = mention.replace("@", "");
                    const newPostMention: TPostMentions = {
                        postId: postDocReference.id,
                        mentionedUserName,
                        mentionUserName: userName,
                    }

                    return firestore().collection(FirestoreCollections.POST_MENTIONS).add(newPostMention);
                });

                await Promise.all(mentionsPromises);
            }

            formik.resetForm();
            setImageUriList([]);
        } catch (error) {
            errorLogger(
                error,
                "Error uploading post > _postformService.uploadPost function.",
                currentUser
            )

            errorToast(error.message, "There was an error sharing your post, plase try again!");
        } finally {
            setLoading(false);
        }
    }

    // #region useEffects
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            let streetLoad: LocationGeocodedAddress[] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            setStreet({ ...streetLoad[0], latitude: location.coords.latitude, longitude: location.coords.longitude });
        })();
    }, []);

    useEffect(() => {
        if (postId) {
            fetchPostDetails();
        }
    }, []);
    
    // Fetch following IDs once on component mount in case the user mentions someone
    useFocusEffect(
        useCallback(() => {
            if(followingIdsRef.current.length === 0){
                fetchFollowingIds();
            }
        }, [])
    );

    useEffect(() => {
        if (debouncedSearchedPlace) {
            fetchPlaces(debouncedSearchedPlace);
        } else {
            setPlaces([]);
        }
    }, [debouncedSearchedPlace]);

    useEffect(() => {
        if (debouncedMention) {
            fetchFollowedUsersByUserInput(debouncedMention);
        } else {
            setFollowingUsers([]);
        }
    }, [debouncedMention]);

    // #region RETURN
    return {
        createTags,
        fetchFollowedUsersByUserInput,
        followingUsers,
        formik,
        handleCaptionChange,
        handleLocationSelectorNavigate,
        i18n,
        imageUriList,
        isGooglePlacesModalVisibile,
        loading,
        mention,
        mentionModalRef,
        pickImage,
        pickImages,
        places,
        setGooglePlacesModalVisibile,
        setMention,
        street,
        tabBarHeight,
        takePhoto,
        updatePost,
        uploadPost,
        removeImage,
    }
}
