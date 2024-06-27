import { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;

export const _bottomsheetService = ({ children, isVisible, onClose }) => {
    const panY = useRef(new Animated.Value(screenHeight)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.spring(panY, {
                toValue: 0,
                tension: 1,
                useNativeDriver: true
            }).start();
        } else {
            Animated.spring(panY, {
                toValue: screenHeight,
                tension: 1,
                useNativeDriver: true
            }).start();
        }
    }, [isVisible, panY]);

    return { panY }
}
