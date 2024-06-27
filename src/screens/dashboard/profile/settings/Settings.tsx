import React from "react";
import {
  ActivityIndicator,
  Text,
  View
} from "react-native";
import { Button } from "../../../../components/button/Button";
import { reportStyles } from "../../../../components/report/Report.Styles";
import { _settingsService } from "./Settings.Services";
import { settingsStyles } from "./Settings.Styles";

export const Settings = () => {
  const {
    handleLogOut,
    loading,
    isProfileDetailsModalVisible,
    setProfileDetailsModalVisible,
    navigation,
    i18n
  } = _settingsService();

  return (
    <View style={settingsStyles.container}>
      <Text>{i18n.t("settingsTitleText")}</Text>
      <View style={{ width: "100%", alignContent: "flex-start" }}>
        <Button
          text={i18n.t("settingsEditProfileDetailsButtonText")}
          onPress={() => navigation.navigate("Profile.Details")}
          styles={reportStyles.categortButtonStyles}
          textStyle={[
            reportStyles.categortButtonTextStyles,
            settingsStyles.profileDetailsBtnText,
          ]}
          descriptionStyle={reportStyles.categoryButtonDescriptionStyles}
        />
        <Button
          text={i18n.t("settingsPreferencesButtonText")}
          onPress={() => navigation.navigate("Profile.Preferences")}
          styles={reportStyles.categortButtonStyles}
          textStyle={[
            reportStyles.categortButtonTextStyles,
            settingsStyles.profileDetailsBtnText,
          ]}
          descriptionStyle={reportStyles.categoryButtonDescriptionStyles}
        />
      </View>
      <Button
        onPress={handleLogOut}
        text={i18n.t("settingsLogOutButtonText")}
        styles={settingsStyles.btn}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color={settingsStyles.activityIndicator.color}
        />
      )}
    </View>
  );
};
