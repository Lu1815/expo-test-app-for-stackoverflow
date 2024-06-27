import React from "react";
import { Text, View } from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/MaterialIcons";
import { globalStyles, primaryColor } from "../../theme/Style";
import { useI18n } from "../../utils/contexts/i18nContext";
import { infoToast } from "../../utils/lib/Toasts";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_DEV_ANDROID_API_KEY || "";

type TGooglePlacesInputProps = {
  onPress?: (data: GooglePlaceData, details: GooglePlaceDetail) => void;
  rowItemToRender?: (rowData: GooglePlaceData) => JSX.Element;
};

const GooglePlacesInput = ({
  onPress = () => {},
  rowItemToRender,
}: TGooglePlacesInputProps) => {
  const { i18n } = useI18n();

  return (
    <GooglePlacesAutocomplete
      placeholder={i18n.t("googlePlacesInputPlaceholderText")}
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: "en", // language of the results
      }}
      debounce={300}
      fetchDetails
      onFail={(error) => console.error(error)}
      onNotFound={() => infoToast(i18n.t("googlePlacesInputNotFoundText"))}
      onPress={(data: GooglePlaceData, details: GooglePlaceDetail) => onPress(data, details)}
      enableHighAccuracyLocation
      enablePoweredByContainer={false}
      renderRow={(rowData: GooglePlaceData) => (
        <>
          {rowItemToRender ? (
            rowItemToRender(rowData)
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                alignContent: "flex-start",
                borderRadius: 5,
              }}
            >
              <Icon name="place" size={20} color={primaryColor} />
              <Text>{rowData.description}</Text>
            </View>
          )}
        </>
      )}
      styles={{
        textInput: {
          ...globalStyles.inputStyleDash,
        },
      }}
    />
  );
};

export default GooglePlacesInput;
