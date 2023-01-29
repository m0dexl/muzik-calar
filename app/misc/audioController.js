// müziği çal

export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("play methodunda hata var", error.message);
  }
};
// müziği durdur

export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("pause methodunda hata var", error.message);
  }
};

// müziği durdurduktan sonra tekrar çal

export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("resume methodunda hata var", error.message);
  }
};

// başka müziği çal

export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("playNext methodunda hata var", error.message);
  }
};

export const selectAudio = async (audio, context) => {
  // console.log("sarkiya basildi");
  // console.log(audio);

  const {
    playbackObj,
    soundObj,
    currentAudio,
    updateState,
    audioFiles,
    OnPlaybackStatusUpdate,
  } = context;

  try {
    // sarkiyi calmak icin
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri);
      // console.log(status);
      //{"androidImplementation": "SimpleExoPlayer", "audioPan": 0, "didJustFinish": false, "durationMillis": 130089, "isBuffering": true, "isLoaded": true,
      // "isLooping": false, "isMuted": false, "isPlaying": true, "playableDurationMillis": 26174, "positionMillis": 0, "progressUpdateIntervalMillis": 500, "rate": 1,
      // "shouldCorrectPitch": false, "shouldPlay": true, "uri": "/storage/emulated/0/Download/Motive_ft_HeijanJeepSuc_Orgutu_Full_En_Kaliteli_Hali.mp3", "volume": 1}
      const index = audioFiles.indexOf(audio);
      updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return playbackObj.setOnPlaybackStatusUpdate(OnPlaybackStatusUpdate);
    }

    // sarkiyi durdurmak için
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(context, { soundObj: status, isPlaying: false });
    }

    // sarkiyi durdurduktan sonra calmak icin
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(context, { soundObj: status, isPlaying: true });
    }

    // baska sarki calmak icin
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      return updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  } catch (error) {
    console.log("selectedAudio methodunda hata var", error.message);
  }
};

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
  } = context;
  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    let audio;
    let index;
    let status;

    // sonraki sarkiya gecmek icin
    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];

      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri);
      }

      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    // onceki sarkiya gecmek icin
    if (select === "previous") {
      audio = audioFiles[currentAudioIndex - 1];

      if (!isLoaded && !isFirstAudio) {
        index = context.currentAudioIndex - 1;
        status = await play(context.playbackObj, audio.uri);
      }

      if (isLoaded && !isFirstAudio) {
        index = context.currentAudioIndex - 1;
        status = await playNext(context.playbackObj, audio.uri);
      }

      if (isFirstAudio) {
        index = context.totalAudioCount - 1;
        audio = context.audioFiles[index];
        if (isLoaded) {
          status = await playNext(context.playbackObj, audio.uri);
        } else {
          status = await play(context.playbackObj, audio.uri);
        }
      }
    }

    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
  } catch (error) {
    console.log("changeAudio methodunda hata var", error.message);
  }
};
