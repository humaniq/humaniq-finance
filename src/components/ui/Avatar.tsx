import React, { ReactNode } from "react";
import { View } from "./View";
import colors from "../../utils/colors";

export interface AvatarProps {
  size: number;
  icon: string;
  children?: ReactNode;
  style?: any;
}

export const Avatar = ({ icon, size, style }: AvatarProps) => {
  return (
    <View
      style={{
        borderRadius: size * 2,
        padding: 8,
        backgroundColor: colors.greyLight,
        ...style,
      }}
    >
      <img alt="" src={icon} style={{ width: size, height: size }} />
    </View>
  );
};
