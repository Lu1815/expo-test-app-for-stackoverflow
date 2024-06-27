import { StyleSheet } from 'react-native';

export const reportStyles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textArea: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        width: '100%',
    },
    categortButtonStyles: {
        backgroundColor: 'white',
        shadowColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 5,
        borderColor: 'black',
        borderBottomWidth: 1,
        alignItems: 'flex-start'
    },
    categortButtonTextStyles: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryButtonDescriptionStyles: {
        color: 'black',
        fontSize: 12,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    }
    // Add styles for the descriptionText if needed
})
