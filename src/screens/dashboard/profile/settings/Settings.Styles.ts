import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    activityIndicator: {
        color: '#0000ff'
    },
    btn: {
        width: 200,
        height: 50,
        backgroundColor: '#F78131',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    profileDetailsBtnText: {
        marginLeft: 10,
    },
    modalView: {
        position: "relative",
        bottom: 0,
        width: "100%",
        height: "100%", // Ajusta esto según cuánto espacio quieres que ocupe el modal
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})
