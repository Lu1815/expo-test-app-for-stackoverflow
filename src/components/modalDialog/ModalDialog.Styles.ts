
import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/Style';

export const modaldialogStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        borderRadius: 20,
        width: 50,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10, // Adds space between the buttons
        backgroundColor: primaryColor
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})
