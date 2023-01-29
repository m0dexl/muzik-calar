import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { Audio } from "expo-av";
import {
  pause,
  play,
  resume,
  playNext,
  selectAudio,
} from "../misc/audioController";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (index) => "audio",
    (type, dimension) => {
      switch (type) {
        case "audio":
          dimension.width = Dimensions.get("window").width;
          dimension.height = 70;
          break;
        default:
          dimension.width = 0;
          dimension.height = 0;
      }
    }
  );
  // OnPlaybackStatusUpdate = async (playbackStatus) => {
  //   // console.log(playbackStatus);
  //   // {"androidImplementation": "SimpleExoPlayer", "audioPan": 0, "didJustFinish": false, "durationMillis": 135653, "isBuffering": false,
  //   // "isLoaded": true, "isLooping": false, "isMuted": false, "isPlaying": true, "playableDurationMillis": 87013, "positionMillis": 274,
  //   // "progressUpdateIntervalMillis": 500, "rate": 1, "shouldCorrectPitch": false, "shouldPlay": true,
  //   // "uri": "/storage/emulated/0/Download/Genc Cocuk.mp3", "volume": 1}
  //   if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
  //     this.context.updateState(this.context, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,
  //     });
  //   }
  //   if (playbackStatus.didJustFinish) {
  //     const nextAudioIndex = this.context.currentAudioIndex + 1;
  //     // son sarkiya gelmissek
  //     if (nextAudioIndex >= this.context.totalAudioCount) {
  //       this.context.playbackObj.unloadAsync();
  //       return this.context.updateState(this.context, {
  //         soundObj: null,
  //         currentAudio: this.context.audioFiles[0],
  //         isPlaying: false,
  //         currentAudioIndex: 0,
  //         playbackPosition: null,
  //         playbackDuration: null,
  //       });
  //     }
  //     // son sarki degilse siradaki sarkiya gecer

  //     const audio = this.context.audioFiles[nextAudioIndex];
  //     const status = await playNext(this.context.playbackObj, audio.uri);
  //     this.context.updateState(this.context, {
  //       soundObj: status,
  //       currentAudio: audio,
  //       isPlaying: true,
  //       currentAudioIndex: nextAudioIndex,
  //     });
  //   }
  // };

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
    // // console.log("sarkiya basildi");
    // // console.log(audio);
    // const { playbackObj, soundObj, currentAudio, updateState, audioFiles } =
    //   this.context;
    // // sarkiyi calmak icin
    // if (soundObj === null) {
    //   const playbackObj = new Audio.Sound();
    //   const status = await play(playbackObj, audio.uri);
    //   // console.log(status);
    //   //{"androidImplementation": "SimpleExoPlayer", "audioPan": 0, "didJustFinish": false, "durationMillis": 130089, "isBuffering": true, "isLoaded": true,
    //   // "isLooping": false, "isMuted": false, "isPlaying": true, "playableDurationMillis": 26174, "positionMillis": 0, "progressUpdateIntervalMillis": 500, "rate": 1,
    //   // "shouldCorrectPitch": false, "shouldPlay": true, "uri": "/storage/emulated/0/Download/Motive_ft_HeijanJeepSuc_Orgutu_Full_En_Kaliteli_Hali.mp3", "volume": 1}
    //   const index = audioFiles.indexOf(audio);
    //   updateState(this.context, {
    //     playbackObj: playbackObj,
    //     soundObj: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   return playbackObj.setOnPlaybackStatusUpdate(
    //     this.context.OnPlaybackStatusUpdate
    //   );
    // }
    // // sarkiyi durdurmak için
    // if (
    //   soundObj.isLoaded &&
    //   soundObj.isPlaying &&
    //   currentAudio.id === audio.id
    // ) {
    //   const status = await pause(playbackObj);
    //   return updateState(this.context, { soundObj: status, isPlaying: false });
    // }
    // // sarkiyi durdurduktan sonra calmak icin
    // if (
    //   soundObj.isLoaded &&
    //   !soundObj.isPlaying &&
    //   currentAudio.id === audio.id
    // ) {
    //   const status = await resume(playbackObj);
    //   return updateState(this.context, { soundObj: status, isPlaying: true });
    // }
    // // baska sarki calmak icin
    // if (soundObj.isLoaded && currentAudio.id !== audio.id) {
    //   const status = await playNext(playbackObj, audio.uri);
    //   const index = audioFiles.indexOf(audio);
    //   return updateState(this.context, {
    //     currentAudio: audio,
    //     soundObj: status,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    // }
  };

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => {
          // console.log("aciliyo");
          this.setState({ ...this.state, optionModalVisible: true });
          this.currentItem = item;
        }}
        onAudioPress={() => this.handleAudioPress(item)}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
      />
    );
  };
  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                isVisible={this.state.optionModalVisible}
                onCloseModal={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                currentItem={this.currentItem}
                onPlayPress={() => console.log("çalıyor")}
                onPlayListPress={() => {
                  this.context.updateState(this.context, {
                    addToPlayList: this.currentItem,
                  });
                  this.props.navigation.navigate("PlayList");
                }}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioList;
