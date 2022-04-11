import React from "react";
import { View, ViewDirections } from "../../ui/View";
import { Text } from "../../ui/Text";
import colors from "../../utils/colors";
import btc from "../../assets/images/ic_btc.svg";
import { Avatar } from "../../ui/Avatar";
import { Divider } from "../../ui/Divider";
import { Button } from "../../ui/Button";

export interface TokenItemProps {
  title: string;
  subTitle: string;
  amount: string;
  subAmount: string;
  onClick?: () => void;
}

export const TokenItem = ({
  title,
  subTitle,
  amount,
  subAmount,
  onClick,
  ...rest
}: TokenItemProps) => {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 8,
      }}
      {...rest}
    >
      <View
        direction={ViewDirections.ROW}
        style={{ alignItems: "flex-start", marginTop: 10, marginBottom: 10 }}
      >
        <Avatar size={36} icon={btc} style={{ marginLeft: 10 }} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            direction={ViewDirections.ROW}
            style={{
              justifyContent: "space-between",
              marginBottom: 5,
              marginRight: 10,
            }}
          >
            <Text color={colors.blackText} text={title} />
            <Text size={17} color={colors.blackText} text={amount} />
          </View>

          <View
            direction={ViewDirections.ROW}
            style={{
              justifyContent: "space-between",
              marginTop: 5,
              marginRight: 10,
            }}
          >
            <Text color={colors.textGrey} text={subTitle} />
            <Text size={15} color={colors.textGrey} text={subAmount} />
          </View>

          <Divider marginT={10} />

          <Button
            onClick={onClick}
            color={colors.blueOrigin}
            textColor={colors.primary}
            text="Deposit 4.06%"
            style={{
              marginTop: 11,
              marginRight: 8,
              borderRadius: 12,
              padding: 9,
            }}
          />
        </View>
      </View>
    </View>
  );
};
