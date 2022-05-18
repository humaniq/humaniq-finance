import React, {useCallback, useEffect} from "react"
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { MainInfoHeader } from "components/main/header/MainInfoHeader";
import { View, ViewDirections } from "components/ui/view/View";
import { Text } from "components/ui/text/Text";
import { AddressView } from "components/main/address/AddressView";
import colors from "../../utils/colors";
import { withStore } from "utils/hoc";
import { HomeViewModel } from "screens/main/HomeViewModel";
import { InfoButton, PLACEMENT } from "components/info-button/InfoButton";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ReactComponent as EllipseIcon } from "../../assets/images/ellipse.svg";
import { LinearProgress } from "components/ui/progress/LinearProgress";
import { LiquidityBottomSheet } from "components/bottom-sheet/LiquidityBottomSheet";
import { Borrows } from "components/borrow/Borrows";
import { Deposits } from "components/deposit/Deposits";
import { getProviderStore } from "App";
import { Loader } from "components/loader/Loader";
import {useNavigate} from "react-router-dom"
import routes from "utils/routes"
import {BorrowSupplyItem} from "models/types"
import "react-spring-bottom-sheet/dist/style.css";
import "../../styles/circular.sass";
import "screens/main/Home.sass";

export interface MainScreenInterface {
  view: HomeViewModel;
}

const HomeImpl: React.FC<MainScreenInterface> = ({ view }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onBorrowOrSupplyClick = useCallback((item: BorrowSupplyItem, isDeposit: boolean = false) => {
    navigate(routes.transaction.path, {
      state: {
        item: JSON.stringify(item),
        isDeposit: isDeposit,
        borrowLimit: view.borrowLimit,
        totalBorrow: view.totalBorrow,
      }
    });
  }, [navigate, view]);

  useEffect(() => {
    (async () => {
      await view.mounted();
    })();
  }, [view]);

  if (view.isRefreshing) return <Loader />;

  return (
    <>
      <View className="main" direction={ViewDirections.COLUMN}>
        <MainInfoHeader className="header">
          <View className={"row"}>
            <Text className={"logoText"} text={t("appName")} />
            <AddressView
              title={view.getAccount}
              onClick={getProviderStore.disconnect}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <CircularProgressbarWithChildren
              background={true}
              strokeWidth={4}
              className="circle"
              value={view.getNetApy}
            >
              <EllipseIcon width="100%" height="100%" className="ellipse" />
              <Text className="circle-title" text={t("home.netApy")} />
              <span className="circle-amount">{view.getNetApy}</span>
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
                  text={t("home.deposited")}
                />
                <Text
                  size={24}
                  className="balance"
                  color={"#fff"}
                  text={view.getSupplyBalance}
                />
              </View>
              <View style={{ marginTop: 8 }} direction={ViewDirections.COLUMN}>
                <Text
                  size={16}
                  color={"#895EF2"}
                  className="label"
                  text={t("home.borrowed")}
                />
                <Text
                  size={24}
                  className="balance"
                  color={"#fff"}
                  text={view.getBorrowBalance}
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
                text={t("home.borrowLimit")}
              />
              <InfoButton
                message={t("hints.borrowLimit")}
                placement={PLACEMENT.BOTTOM}
              />
            </View>
            <LinearProgress progress={view.getBorrowLimitPercentage} amount={view.getBorrowLimit} />
          </View>
        </MainInfoHeader>
        <View className="content" direction={ViewDirections.COLUMN}>
          <Deposits data={view.userSuppliedMarket} onClick={(item) => onBorrowOrSupplyClick(item, true)} />
          <Borrows data={view.userBorrowedMarket} onClick={onBorrowOrSupplyClick} />
        </View>
      </View>
      {/*<LiquidityBottomSheet*/}
      {/*  visible={view.modalVisible}*/}
      {/*  setVisible={() => view.setModalVisible(false)}*/}
      {/*  list={[]}*/}
      {/*/>*/}
    </>
  );
};

export const Home = withStore(HomeViewModel, observer(HomeImpl));