import { Formik } from "formik";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "../../../components/button/Button";
import { LinkBtn } from "../../../components/linkBtn/LinkBtn";
import { validationSchema } from "../../../utils/schemas/Otp.Schema";
import { _otpService } from "./OtpConfirmation.Services";
import { otpStyles } from "./OtpConfirmation.Styles";

export const OtpConfirmation = ({ navigation }) => {
  const { handleCodeConfirmation, loading, handleReturnToLogin } = _otpService();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../../../../assets/backgroundpng.png")}
        resizeMode="stretch"
        style={otpStyles.ImageBackground}
      >
        <ScrollView 
          contentContainerStyle={otpStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{ otpCode: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setTouched }) => {
              setTouched({ otpCode: true });
              handleCodeConfirmation(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Image
                  style={otpStyles.Image}
                  source={require("../../../../assets/no-image.pngpng.png")}
                />

                <TextInput
                  style={otpStyles.inputStyle}
                  onChangeText={handleChange("otpCode")}
                  onBlur={handleBlur("otpCode")}
                  value={values.otpCode}
                  placeholder="OTP Code"
                  keyboardType="number-pad"
                />
                {touched.otpCode && errors.otpCode && (
                  <Text style={otpStyles.errorText}>{errors.otpCode}</Text>
                )}

                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color={otpStyles.activityIndicator.color}
                  />
                ) : (
                  <View style={otpStyles.btnContainer}>
                    <Button
                      onPress={handleSubmit}
                      styles={otpStyles.buttonSpacing}
                      text="Confirm OTP Code"
                    />
                  </View>
                )}
              </>
            )}
          </Formik>
          <LinkBtn
            onPress={handleReturnToLogin}
            styles={otpStyles.buttonSpacing}
            text="Return to login"
          />
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
