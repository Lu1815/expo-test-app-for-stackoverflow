import React from "react";
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

interface Props {
    children?: React.ReactNode | React.ReactNode[];
    visible?: boolean;
    transparent?: boolean;
    dismiss?: () => void;
    margin?: number;
    padding? : number;
}

export const GHDialog = ({children, visible = false, transparent = false, dismiss, margin = 0, padding = 10}: Props) => {
    return (
        <Modal
            visible={visible}
            transparent={transparent}
            onRequestClose={dismiss}>

            <TouchableWithoutFeedback onPress={dismiss}>
                <View style={globalStyles.modalOverlay}/>
            </TouchableWithoutFeedback>

            <View
                style={{
                    ...globalStyles.modalContent,
                    margin: margin,
                    padding: padding,
                }}>
                {children ? children : <Text>Send a child!</Text>}
            </View>

        </Modal>
    );
}

const globalStyles = StyleSheet.create({
    modalContent: {
        justifyContent: "center",
        marginVertical: "100%"
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
});
