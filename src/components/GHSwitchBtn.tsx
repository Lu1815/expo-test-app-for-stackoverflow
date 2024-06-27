import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { primaryColor, whiteColor } from "../theme/Style";

interface Props {
    leftLabel: string; // Label for the left button
    rightLabel: string; // Label for the right button
    selected: boolean; // Whether the left button is selected
    onPress: (selected: boolean) => void; // Callback with the selected state
}

export const GHSwitchBtn = ({
    leftLabel,
    rightLabel,
    selected,
    onPress
}: Props) => {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <View style={{
                width: "50%",
                height: 40,
                borderWidth: .5,
                borderColor: primaryColor,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                padding: 3
            }}>
                <TouchableOpacity style={{
                    width: "50%",
                    height: "96%",
                    backgroundColor: selected ? primaryColor : whiteColor,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    justifyContent: "center",
                    alignItems: "center"
                }} onPress={() => onPress(true)}>
                    <Text style={{
                        color: selected ? whiteColor : primaryColor,
                        fontWeight: "700"
                    }}>{leftLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: "50%",
                    height: "96%",
                    backgroundColor: !selected ? primaryColor : whiteColor,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    justifyContent: "center",
                    alignItems: "center"
                }} onPress={() => onPress(false)}>
                    <Text style={{
                        color: !selected ? whiteColor : primaryColor,
                        fontWeight: "700"
                    }}>{rightLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
