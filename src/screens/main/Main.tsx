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
import { InfoButton, PLACEMENT } from "../../components/info-button/InfoButton";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ReactComponent as Ellipse } from "../../assets/images/ellipse.svg";

import "../../styles/circular.sass";
import "./Main.sass";
import { LinearProgress } from "../../components/ui/progress/LinearProgress";

export interface MainScreenInterface {
  view: MainViewModel;
}

const MainImpl: React.FC<MainScreenInterface> = ({ view }) => {
  const { t } = useTranslation();

  return (
    <View className="main" direction={ViewDirections.COLUMN}>
      <MainInfoHeader className="header">
        <View className={"row"}>
          <Text size={24} className={"logoText"} text={t("appName")} />
          <AddressView title={view.getFormattedAddress} onClick={() => {}} />
        </View>
        <View style={{ marginTop: 16 }}>
          <CircularProgressbarWithChildren
            background={true}
            strokeWidth={4}
            className="circle"
            value={90}
          >
            <Ellipse width="100%" height="100%" className="ellipse" />
            <span className="circle-title">% per year</span>
            <span className="circle-amount">2.70</span>
          </CircularProgressbarWithChildren>
          <View className="deposit-balance" direction={ViewDirections.COLUMN}>
            <View style={{ marginBottom: 8 }} direction={ViewDirections.COLUMN}>
              <Text
                size={16}
                color={"#0066DA"}
                className="label"
                text={t("main.deposited")}
              />
              <Text size={24} className="balance" color={"#fff"} text="$0" />
            </View>
            <View style={{ marginTop: 8 }} direction={ViewDirections.COLUMN}>
              <Text
                size={16}
                color={"#895EF2"}
                className="label"
                text={t("main.borrowed")}
              />
              <Text size={24} className="balance" color={"#fff"} text="$0" />
            </View>
          </View>
        </View>
        <View className="borrow-limit" direction={ViewDirections.COLUMN}>
          <View className="alignH">
            <Text
              size={15}
              color={colors.greyHalf}
              className="label"
              text={t("main.borrowLimit")}
            />
            <InfoButton
              message={t("hints.borrowLimit")}
              placement={PLACEMENT.BOTTOM}
            />
          </View>
          <LinearProgress progress={0} amount="102.34$" />
        </View>
      </MainInfoHeader>
      <View className="content" direction={ViewDirections.COLUMN}>
        <View className="alignH">
          <Text
            size={16}
            className="label"
            color={colors.blackText}
            text={t("main.walletBalance")}
          />
          <InfoButton
            message={t("hints.balance")}
            placement={PLACEMENT.BOTTOM}
            color={colors.blackText}
          />
        </View>
        <View direction={ViewDirections.COLUMN}>
          {view.tokenList.map((item, index) => (
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
          <View className="alignH">
            <Text
              className="label"
              size={16}
              text={t("main.availableToBorrow")}
              color={colors.blackText}
            />
            <InfoButton
              message={t("hints.borrowAvailable")}
              placement={PLACEMENT.BOTTOM}
              color={colors.blackText}
            />
          </View>
          <Button className="liquidity-btn" text={t("main.liquidity")} />
        </View>
        <HintMessage message={t("main.borrowHint")} />
        <View direction={ViewDirections.COLUMN}>
          {view.tokenList.map((item, index) => (
            <TokenItem
              key={`borrow_item_${item.id}_${index}`}
              title={item.title}
              subTitle={item.coin}
              amount={item.amountUSD}
              subAmount={item.amountCOIN}
              disabled={index % 2 === 0}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export const Main = withStore(MainViewModel, observer(MainImpl));
