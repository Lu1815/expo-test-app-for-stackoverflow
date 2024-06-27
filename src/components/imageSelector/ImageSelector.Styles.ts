
import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get("window");

export const imageselectorStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    imageWrapper: {
        margin: 5,
        position: "relative",
    },
    image: {
        width: width / 3 - 10,
        height: width / 3 - 10,
        borderRadius: 10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    selectedCount: {
        padding: 10,
        backgroundColor: "#fff",
        alignItems: "center",
    },
});