import * as Icons from "@expo/vector-icons";
import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const { width } = Dimensions.get('window');

type TDropdownButtonProps = {
  data: { label: string; value: string }[];
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  iconLibrary?: keyof typeof Icons;
};

const DropdownButtonComponent = ({
  data,
  iconColor,
  iconLibrary,
  iconName,
  iconSize
}: TDropdownButtonProps) => {
  const [value, setValue] = useState<string>();
  const ref = useRef<IDropdownRef>(null);
  // Trim whitespace from iconLibrary name
  const trimmedIconLibrary = iconLibrary.trim();
  const IconComponent = Icons[trimmedIconLibrary]; // Selects the icon component based in the specified icon library
  const icon = iconName ? (
    <IconComponent
      name={iconName}
      size={iconSize}
      color={iconColor}
    />
  ) : null;

  const renderIcon = () => {
    return (
      <View style={styles.iconStyle}>
        {icon}
      </View>
    );
  };

  return (
    <Dropdown
      ref={ref}
      style={styles.dropdown}
      containerStyle={styles.containerStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
      onChangeText={() => {}} // Keep search keyword
      renderRightIcon={renderIcon}
    />
  );
};

export default DropdownButtonComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    width: 50,
    marginLeft: width - 80,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingRight: 14,
  },
  containerStyle: {
    width: 200,
    marginLeft: -150,
    marginTop: 5,
  },
  iconStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});