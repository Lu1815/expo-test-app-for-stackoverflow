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
  View,
} from "react-native";
import { Button } from "../../../components/button/Button";
import GoogleAuth from "../../../components/googleAuth/GoogleAuth";
import { Input } from "../../../components/input/Input";
import { LinkBtn } from "../../../components/linkBtn/LinkBtn";
import { globalStyles } from "../../../theme/Style";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { ComponentNames } from "../../../utils/lib/Consts";
import { validationSchema } from "../../../utils/schemas/Login.Schema";
import { _loginService } from "./Login.Services";
import { loginStyles } from "./Login.Styles";

export const Login = ({ navigation }) => {
  const {
    handleSubmit: login,
    handlePasswordReset,
    loading,
    failedLoginCount,
    recaptchaRef,
  } = _loginService();
  const { loading: authLoading } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../../../../assets/backgroundpng.png")}
        resizeMode="stretch"
        style={loginStyles.ImageBackground}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setTouched }) => {
              setTouched({ email: true, password: true });
              login(values);
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
                  style={loginStyles.Image}
                  source={require("../../../../assets/no-image.pngpng.png")}
                />

                <Input
                  containerStyle={globalStyles.inputStyle}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder="Email"
                />
                {touched.email && errors.email && (
                  <Text style={loginStyles.errorText}>{errors.email}</Text>
                )}

                <Input
                  containerStyle={globalStyles.inputStyle}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text style={loginStyles.errorText}>{errors.password}</Text>
                )}

                {loading || authLoading ? (
                  <ActivityIndicator
                    size="large"
                    color={loginStyles.activityIndicator.color}
                  />
                ) : (
                  <View style={loginStyles.btnContainer}>
                    <Button
                      onPress={handleSubmit}
                      styles={loginStyles.buttonSpacing}
                      text="Login"
                    />
                    <Text style={loginStyles.textSpacing}>Or</Text>
                    <GoogleAuth />
                    {failedLoginCount > 0 && (
                      <LinkBtn
                        onPress={() => handlePasswordReset(values.email)}
                        styles={loginStyles.buttonSpacing}
                        text="Forgot password? Press here"
                      />
                    )}
                  </View>
                )}
              </>
            )}
          </Formik>
          <LinkBtn
            onPress={() => navigation.navigate(ComponentNames.SIGNUP)}
            styles={loginStyles.buttonSpacing}
            text="Don't have an account?"
          />
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
