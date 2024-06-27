import { StyleSheet } from 'react-native';

export const googleadStyles = StyleSheet.create({
    card: {
        // Styles that mimic your PostCard's container styles
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 8,
        alignItems: 'center',
        paddingVertical: 10,
    },
    adLabel: {
        // Styles for the 'Sponsored' label
        alignSelf: 'center',
        margin: 4,
        fontSize: 12,
        color: 'gray',
    },
    // Add other styles to match your PostCard's header and footer if necessary
});