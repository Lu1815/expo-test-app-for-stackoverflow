import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  globalStyles,
  grayColor,
  primaryColor,
  whiteColor,
} from "../../theme/Style";
import { GHSwitchBtn } from "../GHSwitchBtn";
import { Button } from "../button/Button";
import ImageList from "../imageList/ImageList";
import { Input, InputProps } from "../input/Input";
import { ModalBottomSheet } from "../modalBottomSheet/ModalBottomSheet";
import SearchItem from "../searchItem/SearchItem";
import { _postformService } from "./PostForm.Services";
import { postformStyles } from "./PostForm.Styles";

type TPostFormProps = {
  isForEditing?: boolean;
  postId?: string | undefined;
};

export const PostForm = ({ isForEditing = false, postId }: TPostFormProps) => {
  const {
    createTags,
    fetchFollowedUsersByUserInput,
    followingUsers,
    formik,
    handleCaptionChange,
    handleLocationSelectorNavigate,
    i18n,
    imageUriList,
    isGooglePlacesModalVisibile,
    loading,
    mention,
    mentionModalRef,
    setMention,
    pickImage,
    pickImages,
    places,
    setGooglePlacesModalVisibile,
    street,
    takePhoto,
    tabBarHeight,
    removeImage,
  } = _postformService({ postId });
  const {
    handleBlur,
    handleChange,
    errors,
    touched,
    handleSubmit,
    values,
    setFieldValue,
    setValues,
  } = formik;

  function renderLocationInput({
    isModalInput,
    values,
  }: {
    isModalInput: boolean;
    values: any;
  }) {
    const inputProps: InputProps = {
      containerStyle: { width: "100%", borderWidth: 0 },
      inputStyle: { paddingHorizontal: 5, borderRadius: 20 },
      placeholder: i18n.t("postFormPlaceInputPlaceholderText"),
      autoCorrect: false,
      onSubmitEditing: Keyboard.dismiss,
      value: values.location,
      onChangeText: (text) => {
        handleChange("location")(text);
      },
      onBlur: handleBlur("location"),
      leftIconName: "location-pin",
      leftIconColor: primaryColor,
      rightIconName: "keyboard-arrow-right",
      rightIconColor: grayColor,
    };

    if (isModalInput) {
      return (
        <Input
          {...inputProps}
          containerStyle={{
            width: "100%",
            position: "relative",
            bottom: 0,
            backgroundColor: whiteColor,
          }}
        />
      );
    } else {
      return (
        <Input
          {...inputProps}
          onPressIn={handleLocationSelectorNavigate}
        />
      );
    }
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={{
          flex: 1,
          backgroundColor: whiteColor,
        }}
        extraScrollHeight={100} // Ajusta este valor según sea necesario
        enableOnAndroid={true}
        keyboardOpeningTime={0} // Ajusta según sea necesario
      >
        <View
          style={{
            borderBottomColor: "#DBDBDB",
            borderBottomWidth: 1,
          }}
        >
          {!isForEditing && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                height: 120,
                padding: 10,
              }}
            >
              <Button
                styles={{
                  width: 110,
                  backgroundColor: whiteColor,
                  borderRadius: 10,
                  borderColor: "#DBDBDB",
                  borderWidth: 1,
                  padding: 10,
                  shadowColor: "transparent",
                }}
                description={i18n.t("addPhotoButtonText")}
                descriptionStyle={{
                  fontSize: 12,
                  textAlign: "center",
                }}
                buttonFlexDirection="column"
                onPress={pickImages}
                iconLibrary="MaterialCommunityIcons"
                iconName="plus-circle"
                iconSize={36}
                iconColor={primaryColor}
              />
              {imageUriList.length > 0 && (
                <ImageList
                  images={[imageUriList[0]]}
                  onRemove={removeImage}
                  containerStyle={{ width: "30%" }}
                  imageContainerStyle={{ width: "100%" }}
                />
              )}
              <Button
                styles={{
                  width: 80,
                  backgroundColor: whiteColor,
                  shadowColor: "transparent",
                }}
                buttonFlexDirection="column"
                description={i18n.t("takePhotoButtonText")}
                descriptionStyle={{
                  fontSize: 12,
                  textAlign: "center",
                  paddingTop: 4,
                }}
                onPress={takePhoto}
                addIconContainer
                iconName="camera-alt"
                iconSize={24}
                iconColor={"white"}
                iconContainerStyle={{
                  padding: 10,
                  borderRadius: 100,
                  backgroundColor: primaryColor,
                }}
              />
            </View>
          )}

          <View style={postformStyles.imageListWrapper}>
            <ImageList
              images={[...imageUriList.slice(1)]}
              onRemove={removeImage}
              containerStyle={{ width: "100%" }}
              imageContainerStyle={{ margin: 5, width: "30%" }}
            />
          </View>

          <View>{renderLocationInput({ isModalInput: false, values })}</View>
        </View>

        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: "#DBDBDB",
            height: 200,
          }}
        >
          <Input
            multiline
            containerStyle={{ borderColor: "transparent", borderWidth: 0 }}
            inputStyle={{ flex: 1, color: "transparent", padding: 10 }}
            placeholder={i18n.t("postFormCaptionInputPlaceholderText")}
            autoCapitalize={"none"}
            autoCorrect={false}
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={handleCaptionChange}
            onBlur={handleBlur("caption")}
            value={values.caption}
            addMentions
          />
        </View>

        <View style={{ flex: 1 }}>
          {values.tags.length > 0 && (
            <View style={postformStyles.pillsContainer}>
              {values.tags.map((tag, index) => (
                <View key={index} style={postformStyles.pill}>
                  <Text style={postformStyles.pillText}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      values.tags.splice(index, 1); // Remove the tag
                      setFieldValue("tags", values.tags); // Update the tags in Formik's state
                    }}
                  >
                    <Text style={postformStyles.pillText}> X </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Input
            containerStyle={{ borderColor: "transparent", borderWidth: 0 }}
            inputStyle={{ paddingHorizontal: 10 }}
            onChangeText={(text) => createTags(text, setFieldValue, values)}
            value={values.tagInputValue}
            placeholder={i18n.t("portFormTagsInputPlaceholderText")}
            leftIconLibrary="MaterialCommunityIcons"
            leftIconName="tag"
            leftIconColor={primaryColor}
            rightIconName="keyboard-arrow-right"
            rightIconColor={grayColor}
          />
        </View>

        <View
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <GHSwitchBtn
            leftLabel={i18n.t("postFormPostPrivacyLeftLabelText")}
            rightLabel={i18n.t("postFormPostPrivacyRightLabelText")}
            selected={values.isPrivate}
            onPress={(selected) => setFieldValue("isPrivate", selected)}
          />
          {loading ? (
            <ActivityIndicator
              size="large"
              color={postformStyles.activityIndicator.color}
            />
          ) : (
            <Button
              onPress={handleSubmit}
              text={
                isForEditing
                  ? `${i18n.t("postFormEditPostButtonText")}`
                  : `${i18n.t("postFormCreatePostButtonText")}`
              }
              styles={postformStyles.shareButton}
              disabled={!formik.isValid}
            />
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* MENTION MODAL */}
      <ModalBottomSheet bottomSheetModalRef={mentionModalRef}>
        <View style={{ padding: 20, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {"Search a person to mention"}
            {/* {i18n.t("postFormMentionModalTitleText")} */}
          </Text>
          <Input
            containerStyle={[globalStyles.inputStyleDash, { width: "100%" }]}
            inputStyle={{ paddingHorizontal: 5, borderRadius: 20 }}
            placeholder={"Type @ followed by the person's username"}
            autoCorrect={false}
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={(text: string) => setMention(text)}
            value={mention}
          />
          {followingUsers.length === 0 && !loading && mention.length > 1 && (
            <Text style={{ textAlign: "center" }}>
              {i18n.t("postFormMentionModalNoUsersFoundText")}
            </Text>
          )}
          {followingUsers.length === 0 && loading ? (
            <ActivityIndicator
              size="large"
              color={postformStyles.activityIndicator.color}
            />
          ) : (
            <FlatList
              data={followingUsers}
              keyExtractor={(item) => item.userEmail}
              renderItem={({ item }) => (
                <SearchItem
                  item={item}
                  onPress={() => {
                    setFieldValue(
                      "caption",
                      `${values.caption}${item.userName}`
                    );
                    mentionModalRef.current.forceClose();
                  }}
                />
              )}
            />
          )}
        </View>
      </ModalBottomSheet>
      {/* MENTION MODAL END */}
    </>
  );
};
