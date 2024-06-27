import { StyleSheet } from "react-native";
import { primaryColor, whiteColor } from "../../../theme/Style";

export const otpStyles = StyleSheet.create({
    btnContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonSpacing: {
        width: 300,
        height: 45,
    },
    textSpacing: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with opacity for contrast
        fontSize: 14,
        padding: 8,
        borderRadius: 4,
    },
    loader: {
        color: '#000ff'
    },
    Image: {
        objectFit: "contain",
        width: "60%"
    },
    ImageBackground: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 10,
    },
    scrollView: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 10,
    },
    errorText: {
        color: '#721c24', // Dark red for better visibility
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with opacity for contrast
        fontSize: 14,
        padding: 8,
        borderRadius: 4,
    },
    activityIndicator: {
        color: '#0000ff'
    },
    inputStyle: {
        backgroundColor: whiteColor,
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: 5,
        padding: 10,
        width: 300,
        color: primaryColor
    }
})