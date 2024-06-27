import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Formik } from "formik";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { globalStyles, primaryColor } from "../../theme/Style";
import { reportValidationSchema } from "../../utils/schemas/Report.Schema";
import { Button } from "../button/Button";
import { OptionsList } from "../optionsList/OptionsList";
import { _reportService } from "./Report.Services";
import { reportStyles } from "./Report.Styles";

type TReportProps = {
  id?: string;
  isAccountReport?: boolean;
};

const Report = ({ id, isAccountReport }: TReportProps) => {
  const {
    categories,
    handleBack,
    handleCategorySelect,
    handleOptionPress,
    handleSubmit,
    selectedCategory,
    step,
    loading,
  } = _reportService({ postOrAccountId: id, isAccountReport });

  return (
    <View style={reportStyles.container}>
      {loading && <Text>Loading...</Text>}

      <ScrollView>
        {step === 1 && (
          <OptionsList
            options={categories}
            onOptionPress={handleOptionPress}
          />
        )}
      </ScrollView>

      {step === 2 && (
        <View style={{ height: "100%", flexDirection: "column", gap: 5 }}>
          <Formik
            initialValues={{ reportDescription: "" }}
            validationSchema={reportValidationSchema}
            onSubmit={(values) => {
              handleSubmit({ ...values });
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
                <View>
                  <Button
                    text="Back"
                    onPress={() => handleBack()}
                    iconName="arrow-left"
                    iconColor="black"
                    iconSize={24}
                    iconPosition="left"
                    styles={{
                      backgroundColor: "white",
                      shadowColor: "white",
                      paddingVertical: 20,
                      alignItems: "flex-start",
                    }}
                    textStyle={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </View>
                <Text style={reportStyles.headerText}>
                  Reporting as: {selectedCategory.name}
                </Text>
                <Text style={reportStyles.categoryButtonDescriptionStyles}>
                  {selectedCategory.description}
                </Text>
                <TextInput
                  style={[
                    globalStyles.inputStyleTextArea,
                    reportStyles.textArea,
                  ]}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe why you are reporting this post..."
                  value={values.reportDescription}
                  onChangeText={handleChange("reportDescription")}
                  onBlur={handleBlur("reportDescription")}
                />
                {touched.reportDescription && errors.reportDescription && (
                  <Text style={reportStyles.errorText}>
                    {errors.reportDescription}
                  </Text>
                )}

                {loading ? (
                  <ActivityIndicator size="large" color={primaryColor} />
                ) : (
                  <Button
                    text="Submit Report"
                    onPress={handleSubmit}
                    styles={{
                      backgroundColor: primaryColor,
                      shadowColor: primaryColor,
                      paddingVertical: 10,
                    }}
                  />
                )}
              </>
            )}
          </Formik>
        </View>
      )}

      {step === 3 && (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="done" size={100} color={primaryColor} /> 
          <Text style={reportStyles.headerText}>Report Submitted</Text>
          <Text style={{ textAlign: 'center' }}>
            We will check the submitted report and take actions if necessary.
            Thank you for helping us keep our community safe.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Report;
