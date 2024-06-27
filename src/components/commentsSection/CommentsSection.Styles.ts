import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/Style';

export const commentsSectionStyles = StyleSheet.create({
    container: {
        padding: 2,
        height: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        borderRadius: 4,
        padding: 8,
        height: 50,
    },
    submitButton: {
        backgroundColor: primaryColor,
        color: 'white',
        padding: 10,
        alignItems: 'center',
        borderRadius: 4,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        paddingVertical: 10,
    },
    inputContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 10,
    },
    noCommentsText: {
        textAlign: 'center',
        marginTop: 20, // Adjust based on your design needs
        fontSize: 16,
        color: 'grey',
        fontWeight: 'bold'
    },
    flatList: {
        flexGrow: 1,
        paddingBottom: 120,
    }
})
