import { StatusBar, StyleSheet } from "react-native";
import { primaryColor, whiteColor } from "../../../theme/Style";

export const searchStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
        gap: 4,
        marginTop: StatusBar.currentHeight,
    },
    searchBarContainer: {
        zIndex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchBar: {
        borderRadius: 10,
    },
    MapSearchBarContainer: {
        position: 'absolute',
        top: "18%", // Adjust the top position as needed
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    MapSearchBar: {
        borderRadius: 10,
        backgroundColor: whiteColor,
        borderColor: "#ddd",
    },
    switchContainer: {
        zIndex: 2,
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 8,
    },
    mapContainer: {
        flex: 1,
    },
    noResults: {
        alignItems: "center",
    },
    mapNoResults: {
        alignItems: "center",
        top: 70
    },
    noResultsText: {
        fontWeight: "bold",
        fontSize: 14,
    },
    resultsContainer: {
        flex: 1,
        backgroundColor: "#eee",
        paddingBottom: 40
    },
    welcomeContainer: {
        alignItems: "center",
        padding: 10,
    },
    welcomeText: {
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    customContainer: {
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        top: 4,
    },
    customTab: {
        width: "20%",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
    },
    customText: {
        fontSize: 11,
        color: primaryColor,
        fontWeight: 'bold'
    },
    dropdown: {
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
        zIndex: 1000,
    },
    dropdownItem: {
        padding: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});