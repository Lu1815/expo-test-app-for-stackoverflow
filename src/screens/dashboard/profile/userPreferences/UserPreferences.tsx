import { Picker } from "@react-native-picker/picker";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Button } from "../../../../components/button/Button";
import { ModalDialog } from "../../../../components/modalDialog/ModalDialog";
import { primaryColor } from "../../../../theme/Style";
import { _userpreferencesService } from "./UserPreferences.Services";
import { userpreferencesStyles } from "./UserPreferences.Styles";

export const UserPreferences = () => {
  const {
    loading,
    saveUserPreferences,
    i18n,
    locale,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleDeleteAccountConfirm,
  } = _userpreferencesService();

  return (
    <ScrollView contentContainerStyle={userpreferencesStyles.contentContainer}>
      <View style={userpreferencesStyles.preferenceContainer}>
        <Text style={userpreferencesStyles.sectionTitle}>
          {i18n.t("userPreferencesSectionTitleText")}
        </Text>
        <Text style={userpreferencesStyles.pickerLabel}>
          {i18n.t("userPreferencesSelectLanguageText")}
        </Text>
        <Picker
          selectedValue={locale}
          onValueChange={saveUserPreferences}
          style={userpreferencesStyles.picker}
          mode="dropdown" // Android only
          aria-disabled={loading}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          {/* <Picker.Item label="French" value="fr" />
            <Picker.Item label="German" value="german" /> */}
          {/* Add more languages as needed */}
        </Picker>
        {loading && <ActivityIndicator size="small" color={primaryColor} />}
      </View>

      <View style={userpreferencesStyles.preferenceContainer}>
        <Text style={userpreferencesStyles.sectionTitle}>
          {i18n.t("userPreferenceAccountSettingsSectionTitleText")}
        </Text>
        <Button
          text={i18n.t("userPreferenceDeleteAccountButtonText")}
          iconLibrary="MaterialIcons"
          iconName="delete"
          iconPosition="right"
          iconColor="red"
          iconSize={20}
          style={userpreferencesStyles.deleteAccountButton}
          textStyle={{ color: "red" }}
          onPress={() => setDeleteModalVisible(true)}
        />
      </View>
      {/* Add more preference options here */}

      <ModalDialog
        modalText={i18n.t("userPreferenceDeleteAccountConfirmationText")}
        isDeleteModalVisible={isDeleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteConfirm={handleDeleteAccountConfirm}
      />
    </ScrollView>
  );
};
