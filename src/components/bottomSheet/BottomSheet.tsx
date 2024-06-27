import React from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { _bottomsheetService } from "./BottomSheet.Services";
import { bottomSheetStyles } from "./BottomSheet.Styles";

const screenHeight = Dimensions.get("window").height;

export const BottomSheet = ({ children, isVisible, onClose }) => {
  const { panY } = _bottomsheetService({ children, isVisible, onClose });

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            bottomSheetStyles(screenHeight).overlay,
            {
              opacity: panY.interpolate({
                inputRange: [0, screenHeight],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          bottomSheetStyles(screenHeight).container,
          {
            transform: [{ translateY: panY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};
