
import { StyleSheet } from 'react-native';
import { primaryColor } from '../../../../theme/Style';

export const addbookmarkcollectionStyles = StyleSheet.create({
    menuButton: {
        marginRight: 20,
        backgroundColor: "white",
        shadowColor: "white",
        borderRadius: 100
    },
    menuButtonContainer: {
        shadowColor: "transparent",
    },
    menuButtonText: {
        backgroundColor: "white",
        color: primaryColor,
        fontSize: 16,
        fontWeight: "bold",
        borderWidth: 0,
    }
})
