import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import PlayListInputModal from "../components/PlayListInputModal";
import colors from "../misc/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";
import PlayListDetail from "../components/PlayListDetail";

let selectedPlayList = {};

const PlayList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];

      updateState(context, {
        addToPlayList: null,
        playList: updatedList,
      });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "Favorilerim",
        audios: [],
      };
      const newPlayList = [...playList, defaultPlayList];
      updateState(context, {
        playList: [...newPlayList],
      });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }
    updateState(context, { playList: JSON.parse(result) });
  };
  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

  const handleBannerPress = async (playList) => {
    // se??ili ??ark?? varsa playlisti g??ncelle
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");

      let oldList = [];
      let sameAudio = false;
      let updatedList = [];

      if (result !== null) {
        oldList = JSON.parse(result);
        // console.log(oldList);
        updatedList = oldList.filter((list) => {
          if (list.id === playList.id) {
            // se??ilen ??ark?? playlistte varm?? diye kontrol
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                // playlistte ayn?? sarki var de
                sameAudio = true;
                return;
              }
            }

            // playlistte yoksa playlisti g??ncelle
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          "Se??ti??iniz ??ark?? ??alma listesinde bulunuyor!",
          `${addToPlayList.filename} ??alma listesinde bulunuyor!`
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }

      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }

    // se??ili ??ark?? yoksa playlisti a??
    // console.log("listeyi a??");
    selectedPlayList = playList;
    setShowPlayList(true);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <TouchableOpacity style={styles.playlistBanner}>
        <Text>Favorilerim</Text>
        <Text style={styles.audioCount}>0 Sarki</Text>
      </TouchableOpacity> */}
        {playList.length
          ? playList.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.playlistBanner}
                onPress={() => handleBannerPress(item)}
              >
                <Text>{item.title}</Text>
                <Text
                  style={styles.audioCount}
                >{`${item.audios.length} ??ark??`}</Text>
              </TouchableOpacity>
            ))
          : null}

        {/* <FlatList
        data={playList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      /> */}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.playListButton}>Yeni ??alma Listesi Ekle</Text>
        </TouchableOpacity>

        <PlayListInputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={createPlayList}
        />
      </ScrollView>
      <PlayListDetail
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
        context={context}
      />
    </>
  );
};

export default PlayList;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playlistBanner: {
    padding: 5,
    backgroundColor: "rgba(204,204,204,0.3)",
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
  },
  playListButton: {
    color: colors.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});
