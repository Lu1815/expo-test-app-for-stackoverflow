import { StyleSheet } from 'react-native';
import { primaryColor, whiteColor } from '../../../theme/Style';

export const profileStyles = StyleSheet.create({
    data: {
        flexDirection: "row",
        padding: 10,
        width: "100%",
        justifyContent: "space-between",
    },
    profileBtn: {
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        borderColor: primaryColor,
        borderWidth: 1,
        backgroundColor: "transparent",
        shadowColor: "transparent",
    },
    profileBtnText: {
        color: primaryColor,
        textAlign: "center",
        fontSize: 12,
        fontWeight: 'bold'
    },
    results: {
        justifyContent: "center",
        flexDirection: "row",
    },
    content: {},
    menuButton: {
        marginRight: 20,
        backgroundColor: "white",
        shadowColor: "white",
        borderRadius: 100
    },
    modalView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "60%", // Ajusta esto según cuánto espacio quieres que ocupe el modal
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    userInfoContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "70%",
        overflow: "visible"
    },
    userInfoTextContainer: {
        width: "80%",
    },
    viewTabsContainer: {
        borderRightWidth: 0.5,
        width: "40%"
    },
    viewTabs: {
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
    },
    viewTabsText: {
        color: primaryColor,
        fontSize: 12,
    },
    viewTabsActive: {
        backgroundColor: primaryColor, 
        borderColor: "#6D6D6D"
    },
    viewTabsTextActive: {
        color: whiteColor
    },
    profileActivityTabsContainer: {
        backgroundColor: "#F9F9F9",
        width: "60%",   
    },
    profileActivityTabsNumber: {
        color: "#606060",
        fontSize: 18,
    },
    profileActiviyTabsText: {
        textAlign: "center",
        color: "#606060",
        fontSize: 12,
    },
})
