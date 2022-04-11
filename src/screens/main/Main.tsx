import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { MainInfoHeader } from "../../components/main/MainInfoHeader";
import { View, ViewDirections } from "../../ui/View";
import { Text } from "../../ui/Text";
import { AddressView } from "../../components/main/AddressView";
import colors from "../../utils/colors";
import { TokenItem } from "../../components/main/TokenItem";
import { withStore } from "../../utils/hoc";
import { MainViewModel } from "./MainViewModel";
import { Button } from "../../ui/Button";
import { HintMessage } from "../../ui/HintMessage";
import { FloatingHintMessage } from "../../ui/FloatingHintMessage";

export interface MainScreenInterface {
  store: MainViewModel;
}

const MainImpl = ({ store }: MainScreenInterface) => {
  const { t } = useTranslation();

  return (
    <View className="main">
      <MainInfoHeader style={{ padding: 16 }}>
        <View
          direction={ViewDirections.ROW}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={{ fontWeight: 800 }}
            size={20}
            text={t<string>("appName")}
          />
          <AddressView title="0x41...0b65" onClick={() => {}} />
        </View>

        <View direction={ViewDirections.ROW} style={{ marginTop: 16 }}>
          <View className="circle">
            <Text className="circle-label" text="123123" />
          </View>

          <View className="deposit-balance">
            <View style={{ marginBottom: 8 }}>
              <Text
                size={16}
                color={"#0066DA"}
                className="label"
                text={t<string>("main.deposited")}
              />
              <Text size={24} className="balance" text="$0" />
            </View>

            <View style={{ marginTop: 8 }}>
              <Text
                size={16}
                color={"#895EF2"}
                className="label"
                text={t<string>("main.borrowed")}
              />
              <Text size={24} className="balance" text="$0" />
            </View>
          </View>
        </View>

        <View className="borrow-limit">
          <View direction={ViewDirections.ROW}>
            <Text
              size={15}
              color={colors.greyHalf}
              className="label"
              text={t<string>("main.borrowLimit")}
            />
          </View>

          <View
            direction={ViewDirections.ROW}
            style={{ marginTop: 10, alignItems: "center" }}
          >
            <Text
              color={colors.white}
              className="left-progress"
              size={14}
              text="0%"
            />
            <View className="progress" />
            <Text
              color={colors.greyHalf}
              className="right-progress"
              size={14}
              text="$0.00"
            />
          </View>
        </View>
      </MainInfoHeader>

      <View className="content">
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={t<string>("main.walletBalance")}
        />

        <View>
          {store.tokenList.map((item, index) => (
            <TokenItem
              key={`token_item_${item.id}_${index}`}
              title={item.title}
              subTitle={item.coin}
              amount={item.amountUSD}
              subAmount={item.amountCOIN}
            />
          ))}
        </View>

        <View className="borrow-available" direction={ViewDirections.ROW}>
          <Text
            size={16}
            text={t<string>("main.availableToBorrow")}
            color={colors.blackText}
          />
          <Button
            text={t<string>("main.liquidity")}
            textColor={colors.primary}
          />
        </View>

        <HintMessage message={t<string>("main.borrowHint")} />

        <View>
          {store.tokenList.map((item, index) => (
            <TokenItem
              key={`borrow_item_${item.id}_${index}`}
              title={item.title}
              subTitle={item.coin}
              amount={item.amountUSD}
              subAmount={item.amountCOIN}
            />
          ))}
        </View>
      </View>

      <FloatingHintMessage message={t<string>("hints.first")} />
    </View>
  );
};

export const Main = withStore(MainViewModel, observer(MainImpl));
