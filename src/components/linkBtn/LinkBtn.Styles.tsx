import { StyleSheet } from "react-native";
import { primaryColor, whiteColor } from "../../theme/Style";

const primaryColorOpacity = "rgba(247, 129, 49, 0.45)";

export const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: primaryColor,
    backgroundColor: primaryColorOpacity,
    color: whiteColor,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  linkText: {
    color: "#0645AD", // A shade of blue for links
    textDecorationLine: "underline",
    paddingVertical: 10, // More padding for a larger touch area
    paddingHorizontal: 12, // Same here for horizontal padding
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with opacity for contrast
    borderRadius: 4,
  },
});
