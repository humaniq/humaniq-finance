import React from "react";
import { View, ViewDirections } from "./View";
import lamp from "../../assets/images/ic_lamp.svg";
import { Text } from "./Text";
import colors from "../../utils/colors";

export interface HintMessageProps {
  message: string;
  backgroundColor?: string;
}

export const HintMessage = ({
  message,
  backgroundColor = colors.white,
}: HintMessageProps) => {
  return (
    <View
      direction={ViewDirections.ROW}
      style={{
        alignItems: "center",
        borderRadius: 12,
        borderStyle: "solid",
        borderColor: colors.yellowStone,
        borderWidth: 1,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 12,
        paddingBottom: 12,
        marginBottom: 10,
        marginTop: 4,
        lineHeight: 1.5,
        backgroundColor,
      }}
    >
      <img alt="hint-message" src={lamp} />
      <Text
        color={colors.blackText}
        size={16}
        text={message}
        style={{ textAlign: "start", marginLeft: 4 }}
      />
    </View>
  );
};
