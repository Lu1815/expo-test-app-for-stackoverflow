
import { StyleSheet } from 'react-native';

export const createbookmarkcollectionStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        gap: 10
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    coverImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    coverImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: "#333",
        marginBottom: 10,
    },
    changeCoverText: {
        marginBottom: 20,
    },
    input: {
        padding: 10,
        width: "50%",
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderRadius: 5,
    },
    menuButton: {
        marginRight: 20,
        backgroundColor: "white",
        shadowColor: "white",
        borderRadius: 100
    },
    errorText: {
        color: "red",
        fontSize: 12,
        paddingVertical: 5
    }
});
