import { StyleSheet } from "react-native";

export const signupStyles = StyleSheet.create({
    btnContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    buttonSpacing: {
        width: 300,
        height: 45,
        marginTop: 5,
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
        flex: 1,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flexGrow: 1,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
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
})