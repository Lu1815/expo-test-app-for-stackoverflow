import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { TUserDetails } from "../../utils/entities";
import { searchitemStyles } from "./SearchItem.Styles";

type TSearchItemProps = {
  item: TUserDetails;
  onPress?: () => void;
};

const SearchItem = ({ 
  item,
  onPress,
}: TSearchItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={searchitemStyles.container}
    >
      <Image
        source={
          item.picture
            ? { uri: item.picture }
            : require("./../../../assets/atardecer_dos.png")
        }
        style={searchitemStyles.image}
      />
      <Text style={searchitemStyles.title}>{item.userName}</Text>
      {/* Add more post details as needed */}
    </TouchableOpacity>
  );
};

export default SearchItem;
