import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useI18n } from "../../utils/contexts/i18nContext";
import { modaldialogStyles } from "./ModalDialog.Styles";

type TModalDialogProps = {
  modalText: string;
  isDeleteModalVisible: boolean;
  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteConfirm: () => void;
};

export const ModalDialog = ({ modalText = "", handleDeleteConfirm, isDeleteModalVisible, setDeleteModalVisible } : TModalDialogProps) => {
  const { i18n } = useI18n();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isDeleteModalVisible}
      onRequestClose={() => {
        setDeleteModalVisible(false);
      }}
    >
      <View style={modaldialogStyles.centeredView}>
        <View style={modaldialogStyles.modalView}>
          <Text style={modaldialogStyles.modalText}>
            {modalText}
          </Text>

          <View style={modaldialogStyles.modalButtons}>
            <TouchableOpacity
              style={modaldialogStyles.button}
              onPress={handleDeleteConfirm}
            >
              <Text style={modaldialogStyles.buttonText}>{i18n.t("modalDialogYesOptionText")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modaldialogStyles.button}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={modaldialogStyles.buttonText}>{i18n.t("modalDialogNoOptionText")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
