import React from "react";
import { View } from "./View";
import { Text } from "./Text";
import colors from "../../utils/colors";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

export interface FloatingHintMessageProps {
  message: string;
  backgroundColor?: string;
}

export const FloatingHintMessage = ({
  message,
  backgroundColor = colors.primary,
}: FloatingHintMessageProps) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        width: 250,
        position: "absolute",
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor,
        paddingTop: 24,
        paddingLeft: 16,
        paddingRight: 16,
        zIndex: 100,
      }}
    >
      <Text
        color={colors.white}
        text={message}
        style={{ textAlign: "start", marginLeft: 4 }}
      />
      <Button
        textColor={colors.white}
        text={t<string>("general.ok")}
        style={{ alignSelf: "flex-end", marginTop: 20, marginBottom: 16 }}
      />
    </View>
  );
};
