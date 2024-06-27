
import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/Style';

export const postFooterStyles = StyleSheet.create({
    contentContainer: {
        padding: 10,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    description: {
        marginVertical: 5,
    },
    username: {
        fontWeight: 'bold',
    },
    caption: {
        fontWeight: 'normal',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 5,
    },
    tagPill: {
        backgroundColor: primaryColor,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
    },
    likesComments: {
        fontSize: 12,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 10,
    },
    button: {
        padding: 10,
        width: 110,
        backgroundColor: "white",
        shadowColor: "white"
    },
    buttonText: {
        color: primaryColor,
    },
})
