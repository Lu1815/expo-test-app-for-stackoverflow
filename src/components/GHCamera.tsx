import React, {useEffect, useRef, useState} from "react";
import {Camera} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import {TouchableOpacity, View, Image, Dimensions, Alert} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export const GHCamera = ({navigation}) => {

    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [image, setImage] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type['back']);
    const camaraRef = useRef(null)

    useEffect(() => {
        (async () => {
            await MediaLibrary.requestPermissionsAsync();
            const camaraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(camaraStatus.status === 'granted');
        })();
    }, [])

    const takePicture = async () => {
        if (!camaraRef) return;
        try {
            const data = await camaraRef.current.takePictureAsync();
            setImage(data.uri);
        } catch (e) {
            Alert.alert("I can't take the picture")
        }
    }

    const retakePicture = () => {
        setImage(null)
    }

    return (
        <View style={{flex: 1, justifyContent: "center", backgroundColor: "black"}}>
            {
                image ?
                    <Image source={{uri: image}} style={{flex: 1, resizeMode: "contain"}}/>
                    :
                    <Camera
                        style={{
                            width: Dimensions.get("window").width,
                            height: Dimensions.get("window").height * .80
                        }}
                        type={type}
                        ref={camaraRef}
                    ></Camera>
            }

            {
                image ?
                    <TouchableOpacity style={{
                        position: 'absolute',
                        bottom: 25,
                        padding: 16,
                        right: 20,
                        left: 20,
                        borderRadius: 20,
                        alignItems: 'center',
                    }} onPress={() => retakePicture()}>
                        <Ionicons name="trash" size={50} color={"#FFF"}/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{
                        position: 'absolute',
                        bottom: 25,
                        padding: 16,
                        right: 20,
                        left: 20,
                        borderRadius: 20,
                        alignItems: 'center',
                    }} onPress={() => takePicture()}>
                        <Ionicons name="camera" size={50} color={"#FFF"}/>
                    </TouchableOpacity>
            }

        </View>
    )
}
