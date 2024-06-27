
import { StyleSheet } from 'react-native';

export const optionslistStyles = StyleSheet.create({
    optionButtonStyles: {
        backgroundColor: 'white',
        shadowColor: 'white',
        // paddingHorizontal: 5,
        // borderColor: 'black',
        // borderBottomWidth: 1,
        alignItems: 'flex-start',
        width: '100%',
    },
    optionButtonTextStyles: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionButtonDescriptionStyles: {
        color: 'black',
        fontSize: 12,
    },
    optionImageStyles: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 20,
    }
})
