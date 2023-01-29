import React from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../misc/colors";
import AudioListItem from "../components/AudioListItem";
import { selectAudio } from "../misc/audioController";

const PlayListDetail = ({ visible, playList, onClose, context }) => {
  const playAudio = (audio) => {
    selectAudio(audio, context);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}> {playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <AudioListItem
                title={item.filename}
                duration={item.duration}
                onAudioPress={() => playAudio(item)}
              />
            </View>
          )}
        />
      </View>
      <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}></View>
    </Modal>
  );
};

export default PlayListDetail;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    height: height - 250,
    width: width - 15,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  modalBG: {
    backgroundColor: colors.MODAL_BG,
    zIndex: -1,
  },
  listContainer: { padding: 20 },
  title: {
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    color: colors.ACTIVE_BG,
  },
});
