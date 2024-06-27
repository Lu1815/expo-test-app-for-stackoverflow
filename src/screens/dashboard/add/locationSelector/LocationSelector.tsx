import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import GooglePlacesInput from "../../../../components/googlePlacesInput/GooglePlacesInput";
import { primaryColor } from "../../../../theme/Style";
import { _locationselectorService } from "./LocationSelector.Services";

type TLocationSelectorProps = {
  setValues: any;
  values: any;
};

export const LocationSelector = ({
  setValues,
  values,
}: TLocationSelectorProps) => {
  const { i18n, navigation } = _locationselectorService();
  const route = useRoute();
  const { setValues: setValuesParam, values: valuesParam } =
    route.params as TLocationSelectorProps;
  const finalValues = valuesParam || values;
  const finalSetValue = setValuesParam || setValues;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 25,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
        {i18n.t("postFormPlacesModalTitleText")}
      </Text>
      <GooglePlacesInput
        onPress={(data: GooglePlaceData, details: GooglePlaceDetail) => {
          finalSetValue({
            ...finalValues,
            location: data.description,
            locationDetails: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            },
          });
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          borderRadius: 5,
          backgroundColor: primaryColor,
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
          {i18n.t("postFormPlacesModalCloseText")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
