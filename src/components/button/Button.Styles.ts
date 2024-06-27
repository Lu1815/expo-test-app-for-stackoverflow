import { StyleSheet } from 'react-native';

export const buttonStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    descriptionText: {
        fontSize: 8,
        color: 'grey',
        flex: 1, 
        flexWrap: 'wrap'
    }
})
