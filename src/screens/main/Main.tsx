import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { MainInfoHeader } from "../../components/main/header/MainInfoHeader";
import { View, ViewDirections } from "../../components/ui/view/View";
import { Text } from "../../components/ui/text/Text";
import { AddressView } from "../../components/main/address/AddressView";
import colors from "../../utils/colors";
import { TokenItem } from "../../components/main/token/TokenItem";
import { withStore } from "../../utils/hoc";
import { MainViewModel } from "./MainViewModel";
import { Button } from "../../components/ui/button/Button";
import { HintMessage } from "../../components/ui/hint/HintMessage";
import "./Main.sass";
import { InfoButton, PLACEMENT } from "../../components/info-button/InfoButton";

export interface MainScreenInterface {
  store: MainViewModel;
}

const MainImpl = ({ store }: MainScreenInterface) => {
  const { t } = useTranslation();

  return (
    <View className="main" direction={ViewDirections.COLUMN}>
      <MainInfoHeader className="header">
        <View className={"row"}>
          <View>
            <span className={"logoText"}>{t<string>("appName")}</span>
            <InfoButton
              message={t("hints.first")}
              placement={PLACEMENT.BOTTOM}
            />
          </View>

          <AddressView title="0x41...0b65" onClick={() => {}} />
        </View>

        <View style={{ marginTop: 16 }}>
          <View className="circle">
            <Text className="circle-label" text="123123" />
          </View>

          <View className="deposit-balance" direction={ViewDirections.COLUMN}>
            <View style={{ marginBottom: 8 }} direction={ViewDirections.COLUMN}>
              <Text
                size={16}
                color={"#0066DA"}
                className="label"
                text={t("main.deposited")}
              />
              <Text size={24} className="balance" text="$0" />
            </View>

            <View style={{ marginTop: 8 }} direction={ViewDirections.COLUMN}>
              <Text
                size={16}
                color={"#895EF2"}
                className="label"
                text={t("main.borrowed")}
              />
              <Text size={24} className="balance" text="$0" />
            </View>
          </View>
        </View>

        <View className="borrow-limit" direction={ViewDirections.COLUMN}>
          <View>
            <Text
              size={15}
              color={colors.greyHalf}
              className="label"
              text={t("main.borrowLimit")}
            />
          </View>

          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Text
              color={colors.white}
              className="left-progress"
              size={14}
              text="0%"
            />
            <View className="progress" direction={ViewDirections.COLUMN} />
            <Text
              color={colors.greyHalf}
              className="right-progress"
              size={14}
              text="$0.00"
            />
          </View>
        </View>
      </MainInfoHeader>

      <View className="content" direction={ViewDirections.COLUMN}>
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={t("main.walletBalance")}
        />

        <View direction={ViewDirections.COLUMN}>
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

        <View className="borrow-available">
          <Text
            size={16}
            text={t("main.availableToBorrow")}
            color={colors.blackText}
          />
          <Button text={t("main.liquidity")} />
        </View>

        <HintMessage message={t("main.borrowHint")} />

        <View direction={ViewDirections.COLUMN}>
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
    </View>
  );
};

export const Main = withStore(MainViewModel, observer(MainImpl));
