import { StyleSheet } from 'react-native';


export const bottomSheetStyles = (screenHeight) => StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: "30%",
        height: "70%",
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
