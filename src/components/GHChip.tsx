import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { primaryColor, whiteColor } from "../theme/Style";

interface Props {
    text : string;
}

export const GHChip = ({ text }: Props) => {
    return (
      <View style={chipStyle.content}>
          <Text style={chipStyle.textContent}>{text}</Text>
      </View>
    );
}

export const chipStyle = StyleSheet.create({
    content: {
        marginHorizontal: 2,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: whiteColor,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: primaryColor
    },
    textContent: {
        color: primaryColor,
        fontWeight: "700"
    }
});
