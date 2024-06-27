import { Formik } from "formik";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "../../../components/button/Button";
import { LinkBtn } from "../../../components/linkBtn/LinkBtn";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { validationSchema } from "../../../utils/schemas/Phone.Schema";
import { _phoneService } from "./Phone.Services";
import { phoneStyles } from "./Phone.Styles";

export const Phone = ({ navigation }) => {
  const { handlePhoneSubmit, loading, handleReturnToLogin } = _phoneService();
  const { loading: loadingAuth } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../../../../assets/backgroundpng.png")}
        resizeMode="stretch"
        style={phoneStyles.ImageBackground}
      >
        <ScrollView 
          contentContainerStyle={phoneStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{ phoneNumber: "", otpStatus: true }}
            validationSchema={validationSchema}
            onSubmit={(values, { setTouched }) => {
              setTouched({ phoneNumber: true, otpStatus: true });
              handlePhoneSubmit(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <>
                <Image
                  style={phoneStyles.Image}
                  source={require("../../../../assets/no-image.pngpng.png")}
                />

                <View style={phoneStyles.container}>
                  <Text style={phoneStyles.textSpacing}>
                    Please enter your phone number so we can verify your
                    identity. Also, select if you want to enable OTP code
                    verification each time you log in.
                  </Text>
                  <TextInput
                    style={phoneStyles.inputStyle}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    placeholder="Phone number: e.g. +1234567890"
                    keyboardType="phone-pad"
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={phoneStyles.errorText}>
                      {errors.phoneNumber}
                    </Text>
                  )}

                  <View style={phoneStyles.switchContainer}>
                    <Switch
                      value={values.otpStatus}
                      onValueChange={(value) => {
                        setFieldValue("otpStatus", value);
                      }}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={values.otpStatus ? "#f5dd4b" : "#f4f3f4"}
                    />
                    <Text style={[phoneStyles.switchText]}>
                      Enable OTP login
                    </Text>
                  </View>

                  {loading || loadingAuth ? (
                    <ActivityIndicator
                      size="large"
                      color={phoneStyles.activityIndicator.color}
                    />
                  ) : (
                    <View style={phoneStyles.btnContainer}>
                      <Button
                        onPress={handleSubmit}
                        styles={phoneStyles.buttonSpacing}
                        text="Send Verification Code"
                      />
                    </View>
                  )}
                  <LinkBtn
                    onPress={handleReturnToLogin}
                    styles={phoneStyles.linkBtn}
                    text="Return to login"
                  />
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
