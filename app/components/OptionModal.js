import React from "react";
import {
  StyleSheet,
  Modal,
  StatusBar,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../misc/colors";

const OptionModal = ({
  isVisible,
  onCloseModal,
  currentItem,
  onPlayPress,
  onPlayListPress,
}) => {
  const { filename } = currentItem;

  return (
    <>
      <StatusBar hidden={true} />
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            {/* <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Oynat</Text>
            </TouchableWithoutFeedback> */}
            <TouchableWithoutFeedback onPress={onPlayListPress}>
              <Text style={styles.option}>Çalma Listesine Ekle</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onCloseModal}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: colors.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modalBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.MODAL_BG,
  },
});
