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
import { validationSchema } from "../../../utils/schemas/Signup.Schema";
import { _signUpService } from "./Signup.Services";
import { signupStyles } from "./Signup.Styles";

export const Signup = ({ navigation }) => {
  const { handleSubmit: signup, loading } = _signUpService({ navigation });
  const { loading: authLoading } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../../../../assets/backgroundpng.png")}
        resizeMode="stretch"
        style={signupStyles.ImageBackground}
      >
        <ScrollView 
          contentContainerStyle={signupStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setTouched }) => {
              setTouched({ email: true, password: true });
              signup(values);
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
                  style={signupStyles.Image}
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
                  <Text style={signupStyles.errorText}>{errors.email}</Text>
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
                  <Text style={signupStyles.errorText}>{errors.password}</Text>
                )}

                {loading || authLoading ? (
                  <ActivityIndicator
                    size="large"
                    color={signupStyles.activityIndicator.color}
                  />
                ) : (
                  <View style={signupStyles.btnContainer}>
                    <Button
                      onPress={handleSubmit}
                      styles={signupStyles.buttonSpacing}
                      text="Create Account"
                    />
                    <Text style={signupStyles.textSpacing}>Or</Text>
                    <GoogleAuth />
                  </View>
                )}
              </>
            )}
          </Formik>
          <LinkBtn
            onPress={() => navigation.navigate(ComponentNames.LOGIN)}
            styles={signupStyles.buttonSpacing}
            text="Already have an account?"
          />
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
