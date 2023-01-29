import React from "react";
import { AntDesign } from "@expo/vector-icons";
import colors from "../misc/colors";

const PlayerButton = (props) => {
  const { iconType, size = 40, iconColor = colors.FONT, onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle";
      case "PAUSE":
        return "playcircleo";
      case "NEXT":
        return "forward";
      case "PREVIOUS":
        return "banckward";
      default:
        break;
    }
  };

  return (
    <AntDesign
      {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
    />
  );
};

export default PlayerButton;
