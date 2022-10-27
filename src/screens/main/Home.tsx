import React, { useCallback, useEffect } from "react"
import { observer } from "mobx-react"
import { MainInfoHeader } from "components/main/header/MainInfoHeader"
import { View, ViewDirections } from "components/ui/view/View"
import { Text } from "components/ui/text/Text"
import { AddressView } from "components/main/address/AddressView"
import colors from "../../utils/colors"
import { withStore } from "utils/hoc"
import { HomeViewModel } from "screens/main/HomeViewModel"
import { InfoButton, PLACEMENT } from "components/info-button/InfoButton"
import { CircularProgressbarWithChildren } from "react-circular-progressbar"
import { ReactComponent as EllipseIcon } from "../../assets/images/ellipse.svg"
import { LinearProgress } from "components/ui/progress/LinearProgress"
import { Borrows } from "components/borrow/Borrows"
import { Deposits } from "components/deposit/Deposits"
import { getProviderStore } from "App"
import { useNavigate } from "react-router-dom"
import routes from "utils/routes"
import { BorrowSupplyItem } from "models/types"
import { useSharedData } from "hooks/useSharedData"
import "react-spring-bottom-sheet/dist/style.css"
import "../../styles/circular.sass"
import "./Home.style.sass"
import { TRANSACTION_TYPE } from "models/contracts/types"
import { t } from "translations/translate"
import { LiquidityBottomSheet } from "components/bottom-sheet/LiquidityBottomSheet"
import { EVM_NETWORKS_NAMES, NETWORK_TYPE } from "constants/network"
import { ConnectWallet } from "components/modals/ConnectWallet"
import { Loader } from "components/loader/Loader"
import { capitalize } from "utils/textUtils"
import { Logo } from "components/logo/Logo"

export interface MainScreenInterface {
  view: HomeViewModel;
}

const HomeImpl: React.FC<MainScreenInterface> = ({ view }) => {
  const navigate = useNavigate()
  const { setData } = useSharedData()

  const onBorrowOrSupplyClick = useCallback((item: BorrowSupplyItem, type: string = TRANSACTION_TYPE.DEPOSIT) => {
    setData({
      item,
      transactionType: type,
      borrowLimit: view.borrowLimit,
      totalBorrow: view.totalBorrow,
      totalDeposit: view.totalSupply
    })
    navigate(routes.transaction.path)
  }, [navigate, view, setData])

  useEffect(() => {
    ;(async () => {
      await view.mounted()
    })()
  }, [view, getProviderStore.currentAccount, getProviderStore.chainId])

  return (
    <>
      <div className="main">
        <MainInfoHeader className="header">
          <div className={"row"}>
            <Logo>
              <span className={"logoText"}>
                {getProviderStore.currentNetwork.env === NETWORK_TYPE.TEST ? `(${capitalize(
                  EVM_NETWORKS_NAMES.BSC_TESTNET
                )})` : ''}
              </span>
            </Logo>
            <AddressView
              title={view.getAccount}
              onClick={view.toggleDialogOrDisconnectWallet}
            />
          </div>
          <View style={{ marginTop: 16 }}>
            <CircularProgressbarWithChildren
              styles={
                {
                  path: {
                    stroke: view.getNetApy < 0 ? colors.redAlert : colors.primary
                  }
                }
              }
              background={true}
              strokeWidth={4}
              className="circle"
              value={100}
            >
              <EllipseIcon width="100%" height="100%" className="ellipse"/>
              <Text className="circle-title" text={t("home.netApy")}/>
              <span className="circle-amount">{view.getNetApyLabel}</span>
            </CircularProgressbarWithChildren>
            <View className="deposit-balance" direction={ViewDirections.COLUMN}>
              <View
                style={{ marginBottom: 8 }}
                direction={ViewDirections.COLUMN}
              >
                <Text
                  size={12}
                  color={"#0066DA"}
                  className="label"
                  text={t("home.deposited")}
                />
                <Text
                  size={22}
                  className="balance"
                  color={"#fff"}
                  text={view.getSupplyBalance}
                />
              </View>
              <View style={{ marginTop: 6 }} direction={ViewDirections.COLUMN}>
                <Text
                  size={12}
                  color={"#895EF2"}
                  className="label"
                  text={t("home.borrowed")}
                />
                <Text
                  size={22}
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
                size={12}
                color={colors.greyHalf}
                className="label"
                text={t("home.borrowLimit")}
              />
              <InfoButton
                message={t("hints.borrowLimit")}
                placement={PLACEMENT.BOTTOM}
              />
            </View>
            <LinearProgress progress={view.getBorrowLimitPercentage} amount={view.getBorrowLimit}/>
          </View>
        </MainInfoHeader>
        <div className={`content ${!getProviderStore.currentAccount ? 'no-connect' : ''}`}>
          {!getProviderStore.currentAccount ? <ConnectWallet/> : (
            <>
              {view.userBalanceMarket.length > 0 && (
                <Deposits
                  isBalance={true}
                  hintText={t("hints.deposits")}
                  title={t("home.walletBalance")}
                  data={view.userBalanceMarket}
                  onClick={onBorrowOrSupplyClick}/>
              )}
              {view.userSuppliedMarket.length > 0 && (
                <Deposits
                  isWithdraw={true}
                  hintText={t("hints.balance")}
                  title={t("home.deposits")}
                  data={view.userSuppliedMarket}
                  onClick={onBorrowOrSupplyClick}/>
              )}
              {view.userBorrowedMarket.length > 0 && (
                <Borrows
                  borrowLimit={view.borrowLimit}
                  totalBorrow={view.totalBorrow}
                  totalSupply={view.totalSupply}
                  isRepay={true}
                  infoButtonBackgroundColor={colors.purpleHeart}
                  showLiquidityButton={false}
                  infoText={t("hints.borrows")}
                  title={t("home.borrows")}
                  data={view.userBorrowedMarket}
                  onClick={(item) => onBorrowOrSupplyClick(item, TRANSACTION_TYPE.REPAY)}/>
              )}
              {view.borrowMarket.length > 0 && (
                <Borrows
                  borrowLimit={view.borrowLimit}
                  totalBorrow={view.totalBorrow}
                  totalSupply={view.totalSupply}
                  infoButtonBackgroundColor={colors.purpleHeart}
                  hintMessage={view.hasCollateral ? undefined : t("home.borrowHint")}
                  infoText={t("hints.borrowAvailable")}
                  isLiquidity={true}
                  title={t("home.availableToBorrow")}
                  onLiquidityClick={() => view.setLiquidityModalVisibility(true)}
                  data={view.borrowMarket}
                  onClick={(item) => onBorrowOrSupplyClick(item, TRANSACTION_TYPE.BORROW)}/>
              )}
            </>
          )}
        </div>
      </div>
      <LiquidityBottomSheet
        list={view.borrowMarket}
        visible={view.liquidityModalVisible}
        onDismiss={() => view.setLiquidityModalVisibility(false)}/>
      <Loader visible={view.isRefreshing || getProviderStore.isConnecting}/>
    </>
  )
}

export const Home = withStore(HomeViewModel, observer(HomeImpl))
