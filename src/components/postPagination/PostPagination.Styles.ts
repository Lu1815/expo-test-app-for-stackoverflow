
import { StyleSheet } from 'react-native';
import { grayColor, primaryColor } from '../../theme/Style';

export const postpaginationStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: grayColor,
    },
    activeDot: {
        backgroundColor: primaryColor,
    },
    inactiveDot: {
        backgroundColor: '#c4c4c4',
    },
});
