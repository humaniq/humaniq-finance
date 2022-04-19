import React, { useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { MainInfoHeader } from "../../components/main/header/MainInfoHeader";
import { View, ViewDirections } from "../../components/ui/view/View";
import { Text } from "../../components/ui/text/Text";
import { AddressView } from "../../components/main/address/AddressView";
import colors from "../../utils/colors";
import { withStore } from "../../utils/hoc";
import { MainViewModel } from "./MainViewModel";
import { InfoButton, PLACEMENT } from "../../components/info-button/InfoButton";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ReactComponent as EllipseIcon } from "../../assets/images/ellipse.svg";
import { LinearProgress } from "../../components/ui/progress/LinearProgress";
import { LiquidityBottomSheet } from "../../components/bottom-sheet/LiquidityBottomSheet";
import { WalletBalance } from "../../components/wallet/WalletBalance";
import { AvailableBorrow } from "../../components/borrow/AvailableBorrow";
import { Deposits } from "../../components/deposit/Deposits";

import "react-spring-bottom-sheet/dist/style.css";
import "../../styles/circular.sass";
import "./Main.sass";

export interface MainScreenInterface {
  view: MainViewModel;
}

const MainImpl: React.FC<MainScreenInterface> = ({ view }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <View className="main" direction={ViewDirections.COLUMN}>
        <MainInfoHeader className="header">
          <View className={"row"}>
            <Text className={"logoText"} text={t("appName")} />
            <AddressView title={view.getFormattedAddress} />
          </View>
          <View style={{ marginTop: 16 }}>
            <CircularProgressbarWithChildren
              background={true}
              strokeWidth={4}
              className="circle"
              value={90}
            >
              <EllipseIcon width="100%" height="100%" className="ellipse" />
              <span className="circle-title">% per year</span>
              <span className="circle-amount">2.70</span>
            </CircularProgressbarWithChildren>
            <View className="deposit-balance" direction={ViewDirections.COLUMN}>
              <View
                style={{ marginBottom: 8 }}
                direction={ViewDirections.COLUMN}
              >
                <Text
                  size={16}
                  color={"#0066DA"}
                  className="label"
                  text={t("main.deposited")}
                />
                <Text
                  size={24}
                  className="balance"
                  color={"#fff"}
                  text="$100.00"
                />
              </View>
              <View style={{ marginTop: 8 }} direction={ViewDirections.COLUMN}>
                <Text
                  size={16}
                  color={"#895EF2"}
                  className="label"
                  text={t("main.borrowed")}
                />
                <Text
                  size={24}
                  className="balance"
                  color={"#fff"}
                  text="$40.00"
                />
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
            <LinearProgress progress={40} amount="102.34$" />
          </View>
        </MainInfoHeader>
        <View className="content" direction={ViewDirections.COLUMN}>
          <Deposits list={view.tokenList} />
          <WalletBalance list={view.tokenList} />
          <AvailableBorrow
            list={view.tokenList}
            onPress={() => setVisible(true)}
          />
        </View>
      </View>
      <LiquidityBottomSheet
        visible={visible}
        setVisible={() => setVisible(false)}
        list={view.tokenList.filter((item) => item.id === 0)}
      />
    </>
  );
};

export const Main = withStore(MainViewModel, observer(MainImpl));
