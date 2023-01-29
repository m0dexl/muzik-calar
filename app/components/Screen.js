import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import colors from "../misc/colors";
const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.APP_BG,
    paddingTop: StatusBar.currentHeight + 25,
  },
});
