
import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/Style';

export const postformStyles = StyleSheet.create({
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        padding: 5
    },
    pill: {
        flexDirection: 'row',
        backgroundColor: primaryColor,
        borderRadius: 20,
        padding: 8,
        marginRight: 5,
        marginBottom: 5,
    },
    pillText: {
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    shareButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    activityIndicator: {
        color: primaryColor
    },
    mention: {
        color: 'blue',
        fontWeight: 'bold',
    },
    hiddenInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 100,
    },
    imageListWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
})
