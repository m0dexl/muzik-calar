import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Modal,
  View,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../misc/colors";

const { width } = Dimensions.get("window");

const PlayListInputModal = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPlayListName] = useState("");
  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPlayListName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={{ color: colors.ACTIVE_BG }}>
            Yeni Çalma Listesi Oluştur!
          </Text>
          <TextInput
            style={styles.input}
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
          />
          <AntDesign
            name="check"
            size={24}
            color={colors.ACTIVE_FONT}
            style={styles.submitIcon}
            onPress={handleOnSubmit}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PlayListInputModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: colors.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: colors.MODAL_BG,
    zIndex: -1,
  },
});
