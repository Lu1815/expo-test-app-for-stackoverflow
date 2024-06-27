import React from "react";
import { TextStyle } from "react-native";
import Toast, {
  BaseToast,
  BaseToastProps,
  ToastConfig,
  ToastShowParams,
} from "react-native-toast-message";

const baseToastProps = ({ borderLeftColor }): BaseToastProps => {
  return {
    style: { borderLeftColor, borderLeftWidth: 2, width: "100%" },
    contentContainerStyle: { padding: 10 },
  };
};

export const toastsConfig: ToastConfig = {
  successToast: (props) => {
    const baseProps = baseToastProps({ borderLeftColor: "#28a745" });

    return <BaseToast {...props} {...baseProps} />;
  },
  errorToast: (props) => {
    const baseProps = baseToastProps({ borderLeftColor: "#dc3545" });

    return <BaseToast {...props} {...baseProps} />;
  },
  infoToast: (props) => {
    const baseProps = baseToastProps({ borderLeftColor: "#17a2b8" });

    return <BaseToast {...props} {...baseProps} />;
  },
};

const defaultToastConfig: ToastShowParams = {
  visibilityTime: 6000,
  swipeable: true,
  position: "top",
  onPress: () => Toast.hide(),
  bottomOffset: 50,
  text1Style: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "left",
  },
  text2Style: {
    fontSize: 13,
  },
};

export const successToast = (
  title: string,
  message?: string,
  titleStyle?: TextStyle,
  messageStyle?: TextStyle
) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    ...defaultToastConfig,
    text1Style: {
      ...titleStyle,
    },
    text2Style: {
      fontSize: title ? 13 : 15,
      ...messageStyle,
    },
  });
};

export const infoToast = (
  title: string,
  message?: string,
  titleStyle?: TextStyle,
  messageStyle?: TextStyle
) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
    ...defaultToastConfig,
    text1Style: {
      ...titleStyle,
    },
    text2Style: {
      fontSize: title ? 13 : 15,
      ...messageStyle,
    },
  });
};

export const errorToast = (
  title: string,
  message?: string,
  titleStyle?: TextStyle,
  messageStyle?: TextStyle
) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    ...defaultToastConfig,
    text1Style: {
      ...titleStyle,
    },
    text2Style: {
      fontSize: title ? 13 : 15,
      ...messageStyle,
    },
  });
};
