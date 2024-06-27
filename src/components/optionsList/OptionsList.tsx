import React from "react";
import { ActivityIndicator, Image, ImageStyle, View } from "react-native";
import { primaryColor } from "../../theme/Style";
import { IOptionsVM } from "../../utils/viewModels/ReportsCategoriesVM";
import { Button } from "../button/Button";
import { optionslistStyles } from "./OptionsList.Styles";

const DEFAULT_IMAGE = process.env.EXPO_PUBLIC_DEFAULT_BOOKMARK_IMAGE;

type TOptionsListProps = {
  options: IOptionsVM[];
  onOptionPress: (option: IOptionsVM) => void;
  addImage?: boolean;
  imageStyles?: ImageStyle | ImageStyle[];
};

export const OptionsList = ({
  options,
  onOptionPress,
  addImage,
  imageStyles,
}: TOptionsListProps) => {
  return (
    <>
      {!options && <ActivityIndicator size="large" color={primaryColor} />}
      {options.map((option) => (
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 20,
            marginHorizontal: 5,
            borderColor: "black",
            borderBottomWidth: 1,
            gap: 10,
          }}
          key={option.id}
        >
          {addImage && (
            <Image
              source={{ uri: option.optionImage || DEFAULT_IMAGE }}
              style={[optionslistStyles.optionImageStyles, imageStyles]}
              key={option.id + "image"}
            />
          )}
          <Button
            text={option.name}
            description={
              option.description
                ? option.description.length > 50
                  ? `${option.description.substring(0, 50)}...`
                  : option.description
                : ""
            }
            iconName={option.iconName}
            iconLibrary={option.iconLibrary}
            iconColor={option.iconColor ? option.iconColor : primaryColor}
            onPress={() => onOptionPress(option)}
            styles={optionslistStyles.optionButtonStyles}
            textStyle={{
              ...optionslistStyles.optionButtonTextStyles,
              color: option.iconColor ? option.iconColor : "#000",
            }}
            descriptionStyle={optionslistStyles.optionButtonDescriptionStyles}
          />
        </View>
      ))}
    </>
  );
};
