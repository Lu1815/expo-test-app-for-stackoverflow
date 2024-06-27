import { Dimensions, StyleSheet } from 'react-native';

export const withLess: number = Dimensions.get("window").width - 30;

export const primaryColor: string = "#F78131"
export const whiteColor: string = "#FFFFFF"
export const grayColor: string = "#A9A9A9"

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyle: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
        color: whiteColor,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: .30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    inputStyle: {
        backgroundColor: whiteColor,
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: 300,
        color: primaryColor
    },
    containerDash: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    inputStyleDash: {
        color: primaryColor,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: grayColor,
        backgroundColor: whiteColor,
        width: "75%",
    },
    inputStyleTextArea: {
        alignItems: 'flex-start',
        color: primaryColor,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: grayColor,
        padding: 5,
        width: "70%",
        height: 100,
        textAlignVertical: 'top',
        backgroundColor: whiteColor,
        paddingHorizontal: 10,
    },
});
