import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/Style';

export const postcardStyles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 },
        marginBottom: 10,
        overflow: 'hidden',
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between', // Adjust this to space out items
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    caption: {
        fontWeight: 'normal',
    },
    userInfoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center"
    },
    contentContainer: {
        padding: 10,
    },
    location: {
        fontStyle: 'italic',
        fontSize: 12
    },
    tags: {
        color: '#007bff',
    },
    description: {
        marginVertical: 5,
    },
    likesComments: {
        fontSize: 12,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 10,
    },
    reportButton: {
        // Style for the report button, adjust as needed
        padding: 10,
        marginRight: 10, // Add some right margin if needed
    },
    button: {
        padding: 10,
        width: 110,
        backgroundColor: "white",
        shadowColor: "white"
    },
    buttonText: {
        color: primaryColor,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 5,
    },
    tagPill: {
        backgroundColor: primaryColor,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
    },
    modalView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "60%", // Ajusta esto según cuánto espacio quieres que ocupe el modal
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
    },
    closeButton: {
        backgroundColor: "#2196F3", // Este es solo un ejemplo, puedes ajustar el color
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignSelf: "center",
        marginTop: 10,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    bottomSheetcontentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});