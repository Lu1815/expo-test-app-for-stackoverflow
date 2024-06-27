
import { StyleSheet } from 'react-native';

export const userinfoStyles = StyleSheet.create({
    userInfoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    headerText: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center"
    },
    username: {
        fontWeight: 'bold',
        color: '#190494'
    },
    fullName: {
        fontSize: 8,  
        color: '#DDDD',
    },
    location: {
        fontStyle: 'italic',
        fontSize: 12
    },
    captionContainer: {
        display: "flex",
        flexDirection: "row",
    },
    caption: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 12,
        color: '#000000',
    }
})
