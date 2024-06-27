import * as Icons from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from "react-native";
import { globalStyles } from "../../theme/Style";
import { buttonStyles } from "./Button.Styles";

interface IButtonProps extends TouchableOpacityProps {
  text?: string;
  description?: string;
  styles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  descriptionStyle?: TextStyle | TextStyle[];
  buttonFlexDirection?: "row" | "column";
  onPress?: () => void;
  iconName?: string;
  iconPosition?: "left" | "right" | "center";
  iconSize?: number;
  iconColor?: string;
  iconLibrary?: keyof typeof Icons;
  addIconContainer?: boolean;
  iconContainerStyle?: ViewStyle | ViewStyle[];
}

export const Button = ({
  text,
  description,
  styles = {},
  textStyle = {},
  descriptionStyle = {},
  buttonFlexDirection = "row",
  onPress,
  iconName,
  iconPosition = "left",
  iconSize = 24,
  iconColor = "#ffffff",
  iconLibrary = "MaterialIcons",
  addIconContainer = false,
  iconContainerStyle = {},
  ...otherProps
}: IButtonProps) => {
  // Trim whitespace from iconLibrary name
  const trimmedIconLibrary = iconLibrary.trim();
  const IconComponent = Icons[trimmedIconLibrary]; // Selects the icon component based in the specified icon library
  const icon = iconName ? (
    <IconComponent
      name={iconName}
      size={iconSize}
      color={iconColor}
      style={{
        marginRight: (iconPosition === "left" && text) ? 5 : 0,
        marginLeft: (iconPosition === "right" && text) ? 5 : 0,
        marginTop: (buttonFlexDirection === "column" && !addIconContainer) ? 10 : 0,
      }}
    />
  ) : null;

  const iconContainer = (
    <View style={[ iconContainerStyle, { marginTop: (buttonFlexDirection === "column") ? 20 : 0 }]}>
      {icon}
    </View>
  )

  const buttonContent = (
    <View style={[buttonStyles.container, { 
      flexDirection: buttonFlexDirection,
    }]}>
      {iconPosition === "left" && addIconContainer ? iconContainer : ( iconPosition === "left" && icon)}
      {/* I DID THIS BECAUSE FOR SOME REASON, WHEN ADDING A DESCRIPTION WITHOUT A TEXT, THE VIEW CREATES A BOTTOM SPACE WICH BUGS THE APP UI */}
      { text && 
        <View style={{ flexDirection: 'column', alignContent: 'flex-start' }}>
          <Text style={[globalStyles.buttonText, textStyle]}>{text}</Text>
          {description && <Text style={[buttonStyles.descriptionText, descriptionStyle]}>{description}</Text>}
        </View>
      }
      {(description && !text) && <Text style={[buttonStyles.descriptionText, descriptionStyle]}>{description}</Text>}
      {iconPosition === "right" && addIconContainer ? iconContainer : ( iconPosition === "right" && icon)}
    </View>
  );

  const ios = () => (
    <TouchableOpacity style={[globalStyles.buttonStyle, styles, otherProps.disabled && { opacity: 40 }]} onPress={onPress} {...otherProps}>
      {buttonContent}
    </TouchableOpacity>
  );

  const android = () => (
    <TouchableOpacity style={[globalStyles.buttonStyle, styles]} onPress={onPress} {...otherProps}>
      {buttonContent}
    </TouchableOpacity>
  );

  return Platform.OS === "ios" ? ios() : android();
};
