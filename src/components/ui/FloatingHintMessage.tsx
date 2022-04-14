import React, { FC } from "react";
import { View } from "./view/View";
import { Text } from "./text/Text";
import colors from "../../utils/colors";
import { Button } from "./button/Button";
import { useTranslation } from "react-i18next";

export interface FloatingHintMessageProps {
  message: string;
  backgroundColor?: string;
  className?: string;
}

export const FloatingHintMessage: FC<FloatingHintMessageProps> = ({
  message,
  backgroundColor = colors.primary,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <View
      className={`${className}`}
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
        text={t<string>("general.ok")}
        style={{ alignSelf: "flex-end", marginTop: 20, marginBottom: 16 }}
      />
    </View>
  );
};
