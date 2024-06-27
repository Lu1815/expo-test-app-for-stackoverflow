import * as Icons from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  FlatList,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import { _inputService } from "./Input.Services";
import { inputStyles } from "./Input.Styles";

export interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle;
  leftIconName?: string;
  leftIconLibrary?: keyof typeof Icons;
  leftIconSize?: number;
  leftIconColor?: string;
  leftIconPress?: () => void;
  rightIconName?: string;
  rightIconLibrary?: keyof typeof Icons;
  rightIconSize?: number;
  rightIconColor?: string;
  rightIconPress?: () => void;
  children?: React.ReactNode;
  addMentions?: boolean;
  multiline?: boolean;
  addFilters?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  onFilterSelect?: (filter: string | null) => void;
}

export const Input = ({
  containerStyle,
  inputStyle,
  leftIconName,
  leftIconLibrary = "MaterialIcons",
  leftIconSize = 24,
  leftIconColor = "#000",
  leftIconPress,
  rightIconName,
  rightIconLibrary = "MaterialIcons",
  rightIconSize = 24,
  rightIconColor = "#000",
  rightIconPress,
  children,
  addMentions = false,
  multiline = false,
  addFilters = false,
  filterOptions = [],
  onFilterSelect,
  ...textInputProps
}: InputProps) => {
  const {
    dropdownVisible,
    handleFilterSelect,
    selectedFilter,
    setDropdownVisible,
    i18n,
  } = _inputService({ onFilterSelect });

  const LeftIconComponent = Icons[leftIconLibrary.trim()];
  const RightIconComponent = Icons[rightIconLibrary.trim()];

  const leftIcon = leftIconName ? (
    <LeftIconComponent
      name={leftIconName}
      size={leftIconSize}
      color={leftIconColor}
      style={inputStyles.icon}
      onPress={leftIconPress}
    />
  ) : null;

  const rightIcon = addFilters ? (
    <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
      <RightIconComponent
        name="filter-list"
        size={rightIconSize}
        color={rightIconColor}
        style={inputStyles.icon}
      />
    </TouchableOpacity>
  ) : rightIconName ? (
    <RightIconComponent
      name={rightIconName}
      size={rightIconSize}
      color={rightIconColor}
      style={inputStyles.icon}
      onPress={rightIconPress}
    />
  ) : null;

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        inputStyles.filterItem,
        selectedFilter === item.label && inputStyles.selectedFilterItem,
      ]}
      onPress={() => handleFilterSelect(item.label)}
    >
      <Text
        style={[
          inputStyles.filterText,
          selectedFilter === item.label && inputStyles.selectedFilterText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={inputStyles.wrapper}>
      {addMentions ? (
        <MentionableInput
          containerStyle={containerStyle}
          inputStyle={inputStyle}
          textInputProps={textInputProps}
          multiline={multiline}
        />
      ) : (
        <View style={[inputStyles.container, containerStyle]}>
          {leftIcon}
          {children || (
            <TextInput
              style={[inputStyles.input, inputStyle]}
              multiline={multiline}
              {...textInputProps}
            />
          )}
          {rightIcon}
          {dropdownVisible && (
            <View style={inputStyles.dropdown}>
              <FlatList
                data={filterOptions}
                renderItem={renderFilterItem}
                keyExtractor={(item) => item.value}
              />
            </View>
          )}
        </View>
      )}
      {selectedFilter && (
        <Text style={inputStyles.filterText}>
          {i18n.t("searchSelectedFilterText")} {selectedFilter.toLowerCase()}
        </Text>
      )}
    </View>
  );
};

const MentionableInput = ({
  containerStyle,
  inputStyle,
  textInputProps,
  multiline = false,
}: {
  containerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle;
  textInputProps?: TextInputProps;
  multiline?: boolean;
}) => {
  const { interpolatedScrollY, onScroll } = _inputService({});

  return (
    <View
      style={[
        inputStyles.container,
        containerStyle,
        { position: "relative", overflow: "scroll" },
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: interpolatedScrollY,
          left: 0,
          right: 0,
        }}
      >
        <ParsedText
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            width: multiline ? "95%" : "100%",
          }}
          parse={[
            {
              pattern: /@\w+/g,
              style: { color: "blue", fontWeight: "bold" },
            },
          ]}
        >
          {textInputProps.value}
        </ParsedText>
      </Animated.View>
      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <TextInput
          style={[inputStyles.input, inputStyle]}
          multiline={multiline}
          {...textInputProps}
        />
      </Animated.ScrollView>
    </View>
  );
};
