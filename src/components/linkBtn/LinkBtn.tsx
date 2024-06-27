import React from "react";
import { Platform, Text, TouchableNativeFeedback, TouchableOpacity } from "react-native";
import { styles as componentStyle } from "./LinkBtn.Styles";

interface Props {
    text: string;
    onPress?: (param: any ) => void;
    styles?: styleProps
}

interface styleProps {
    width?: number,
    height?: number,
    marginTop?: number,
    marginBottom?: number,
    borderRadius?: number
}

export const LinkBtn = ({text, onPress, styles}: Props) => {

    const content = (
        <Text style={[componentStyle.linkText, styles]}> {text} </Text>
    );

    // Use the Touchable component appropriate for the platform
    return Platform.OS === 'ios' ? (
        <TouchableNativeFeedback onPress={onPress}>
            {content}
        </TouchableNativeFeedback>
    ) : (
        <TouchableOpacity onPress={onPress}>
            {content}
        </TouchableOpacity>
    );
}