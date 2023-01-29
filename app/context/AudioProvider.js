import React, { Component, createContext } from "react";
import { View, Text, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import { Audio } from "expo-av";
import { playNext } from "../misc/audioController";

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((row1, row2) => row1 !== row2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
      playList: [],
      addToPlayList: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAllert = () => {
    Alert.alert(
      "İzniniz Gerekiyor!",
      "Uygulamanın çalışması için dosyalarınıza erişmesi gerekiyor!"
    ),
      [
        {
          text: "İzin veriyorum",
          onPress: () => this.getPermission(),
        },
        {
          text: "İzin vermiyorum",
          onPress: () => this.permissionAllert(),
        },
      ];
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;

    // console.log(media);
    //"assets":
    //  [{"albumId": "540528482", "creationTime": 0, "duration": 135.654, "filename": "Genc Cocuk.mp3", "height": 0,
    //      "id": "14101", "mediaType": "audio", "modificationTime": 1662568430000,
    //      "uri": "file:///storage/emulated/0/Download/Genc Cocuk.mp3", "width": 0}],
    //   "endCursor": "17", "hasNextPage": false, "totalCount": 17}

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  getPermission = async () => {
    // medialibrary permission
    // {
    //     "canAskAgain": true,
    //     "expires": "never",
    //     "granted": false,
    //     "status": "undetermined",
    // }

    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      // izin verildiyse ses dosyalarını al
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      //izin verilmediyse izin iste
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        // izin verilmediyse izin verilmesi gerektiğini göster
        this.permissionAllert();
        // this.setState({ ...this.state, permissionError: true });
      }
      if (status === "granted") {
        //ses dosyalarını al
        this.getAudioFiles();
      }
      if (status === "denied" && !canAskAgain) {
        // izin verilmediği için hata göster
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  OnPlaybackStatusUpdate = async (playbackStatus) => {
    // console.log(playbackStatus);
    // {"androidImplementation": "SimpleExoPlayer", "audioPan": 0, "didJustFinish": false, "durationMillis": 135653, "isBuffering": false,
    // "isLoaded": true, "isLooping": false, "isMuted": false, "isPlaying": true, "playableDurationMillis": 87013, "positionMillis": 274,
    // "progressUpdateIntervalMillis": 500, "rate": 1, "shouldCorrectPitch": false, "shouldPlay": true,
    // "uri": "/storage/emulated/0/Download/Genc Cocuk.mp3", "volume": 1}
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      // son sarkiya gelmissek
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObj.unloadAsync();
        return this.updateState(this, {
          soundObj: null,
          currentAudio: this.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
      }
      // son sarki degilse siradaki sarkiya gecer

      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
      playList,
      addToPlayList,
    } = this.state;
    if (permissionError) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 25, textAlign: "center", color: "red" }}>
            İzin vermeniz gerekiyor.
          </Text>
        </View>
      );
    }
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          updateState: this.updateState,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          OnPlaybackStatusUpdate: this.OnPlaybackStatusUpdate,
          playList,
          addToPlayList, 
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
