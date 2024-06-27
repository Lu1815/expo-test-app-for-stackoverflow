// ProfileDetails.tsx
import React from "react";
import { ActivityIndicator, Button, Image, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../../../../components/input/Input";
import { primaryColor } from "../../../../theme/Style";
import { _profiledetailsService } from "./ProfileDetails.Services";
import { profiledetailsStyles } from "./ProfileDetails.Styles";

export const ProfileDetails = () => {
  const { pickImage, profileImage, takePhoto, formik, i18n, isLoading } =
    _profiledetailsService();

  return (
    <View style={profiledetailsStyles.container}>
      <View style={profiledetailsStyles.imagePickerContainer}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={profiledetailsStyles.profileImage}
          />
        ) : (
          <Image
            style={{ width: 100, height: 100, borderRadius: 100 }}
            source={require("../../../../../assets/no-image.png")}
          />
        )}
        <View style={profiledetailsStyles.buttonContainer}>
          <Button title={i18n.t("profileDetailsSelectImageButtonText")} onPress={pickImage} color="#F78131" />
          <Button title={i18n.t("profileDetailsTakePhotoButtonText")} onPress={takePhoto} color="#F78131" />
        </View>
      </View>
      <Input
        leftIconName="rename-box"
        leftIconLibrary="MaterialCommunityIcons"
        multiline
        leftIconColor={primaryColor}
        placeholder={i18n.t("profileDetailsUsernameInputPlaceholderText")}
        onChangeText={formik.handleChange("username")}
        onBlur={formik.handleBlur("username")}
        value={formik.values.username}
        containerStyle={profiledetailsStyles.inputContainer}
      />

      <Input
        leftIconName="description"
        multiline
        leftIconColor={primaryColor}
        placeholder={i18n.t("profileDetailsDescriptionInputPlaceholderText")}
        onChangeText={formik.handleChange("description")}
        onBlur={formik.handleBlur("description")}
        value={formik.values.description}
        containerStyle={profiledetailsStyles.inputContainer}
      />
      {formik.touched.description && formik.errors.description && (
        <Text style={profiledetailsStyles.errorText}>{formik.errors.description}</Text>
      )}

      <Input
        leftIconName="phone"
        leftIconColor={primaryColor}
        placeholder={i18n.t("profileDetailsPhoneNumberInputPlaceholderText")}
        onChangeText={formik.handleChange("phoneNumber")}
        onBlur={formik.handleBlur("phoneNumber")}
        value={formik.values.phoneNumber}
        keyboardType="phone-pad"
        containerStyle={profiledetailsStyles.inputContainer}
      />
      {formik.touched.phoneNumber && formik.errors.phoneNumber && (
        <Text style={profiledetailsStyles.errorText}>{formik.errors.phoneNumber}</Text>
      )}

      {
        isLoading 
        ? <ActivityIndicator size="large" color={primaryColor} />
        : (
          <TouchableOpacity
            onPress={() => formik.handleSubmit()}
            style={profiledetailsStyles.submitButton}
          >
            <Text style={profiledetailsStyles.submitButtonText}>{i18n.t("profileDetailsSubmitButtonText")}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
};
