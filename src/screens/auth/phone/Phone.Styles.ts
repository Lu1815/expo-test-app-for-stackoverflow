import { StyleSheet } from "react-native";
import { primaryColor, whiteColor } from "../../../theme/Style";

const whiteOpaque = 'rgba(255,255,255,0.5)';

export const phoneStyles = StyleSheet.create({
    btnContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    buttonSpacing: {
        height: 45,
        marginTop: 5,
        width: '100%',
    },
    textSpacing: {
        backgroundColor: whiteOpaque, // White with opacity for contrast
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
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 2,
    },
    scrollView: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 2,
    },
    errorText: {
        marginBottom: 10,
        color: '#721c24', // Dark red for better visibility
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with opacity for contrast
        fontSize: 14,
        padding: 8,
        borderRadius: 4,
        marginTop: 4, // Spacing between the input field and the error message
    },
    activityIndicator: {
        color: '#0000ff'
    },
    switchContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignContent: "center",
        backgroundColor: whiteOpaque,
        borderRadius: 4,
        padding: 4,
    },
    switchText: {
        fontSize: 14,
        marginTop: 5
    },
    container: {
        width: 300,
        display: "flex",
        flexDirection: "column",
        marginTop: 5,
        gap: 10,
    },
    inputStyle: {
        backgroundColor: whiteColor,
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: 5,
        padding: 10,
        color: primaryColor
    },
    linkBtn: {
        height: 45,
        marginTop: 5,
    }
})