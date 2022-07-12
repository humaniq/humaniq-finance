import React, {useCallback, useEffect} from "react"
import {observer} from "mobx-react"
import {MainInfoHeader} from "components/main/header/MainInfoHeader"
import {View, ViewDirections} from "components/ui/view/View"
import {Text} from "components/ui/text/Text"
import {AddressView} from "components/main/address/AddressView"
import colors from "../../utils/colors"
import {withStore} from "utils/hoc"
import {HomeViewModel} from "screens/main/HomeViewModel"
import {InfoButton, PLACEMENT} from "components/info-button/InfoButton"
import {CircularProgressbarWithChildren} from "react-circular-progressbar"
import {ReactComponent as EllipseIcon} from "../../assets/images/ellipse.svg"
import {LinearProgress} from "components/ui/progress/LinearProgress"
import {Borrows} from "components/borrow/Borrows"
import {Deposits} from "components/deposit/Deposits"
import {getProviderStore} from "App"
import {Loader} from "components/loader/Loader"
import {useNavigate} from "react-router-dom"
import routes from "utils/routes"
import {BorrowSupplyItem} from "models/types"
import {useSharedData} from "hooks/useSharedData"
import {ConnectionNotSupported} from "components/connection-support/ConnectionNotSupported"
import "react-spring-bottom-sheet/dist/style.css"
import "../../styles/circular.sass"
import "./Home.style.sass"
import {TRANSACTION_TYPE} from "models/contracts/types"
import {t} from "translations/translate"

export interface MainScreenInterface {
  view: HomeViewModel;
}

const HomeImpl: React.FC<MainScreenInterface> = ({view}) => {
  const navigate = useNavigate()
  const {setData} = useSharedData()

  const onBorrowOrSupplyClick = useCallback((item: BorrowSupplyItem, type: string = TRANSACTION_TYPE.DEPOSIT) => {
    setData({
      item,
      transactionType: type,
      borrowLimit: view.borrowLimit,
      totalBorrow: view.totalBorrow
    })
    navigate(routes.transaction.path)
  }, [navigate, view, setData])

  useEffect(() => {
    ;(async () => {
      await view.mounted()
    })()
  }, [view])

  if (view.isRefreshing) return <Loader/>

  if (!view.isConnectionSupported) return <ConnectionNotSupported/>

  return (
    <>
      <div className="main">
        <MainInfoHeader className="header">
          <div className={"row"}>
            <span className={"logoText"}>{t("appName")}</span>
            <AddressView
              title={view.getAccount}
              onClick={getProviderStore.toggleDisconnectDialog}
            />
          </div>
          <View style={{marginTop: 16}}>
            <CircularProgressbarWithChildren
              background={true}
              strokeWidth={4}
              className="circle"
              value={view.getNetApy}
            >
              <EllipseIcon width="100%" height="100%" className="ellipse"/>
              <Text className="circle-title" text={t("home.netApy")}/>
              <span className="circle-amount">{view.getNetApyLabel}</span>
            </CircularProgressbarWithChildren>
            <View className="deposit-balance" direction={ViewDirections.COLUMN}>
              <View
                style={{marginBottom: 8}}
                direction={ViewDirections.COLUMN}
              >
                <Text
                  size={15}
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
              <View style={{marginTop: 8}} direction={ViewDirections.COLUMN}>
                <Text
                  size={15}
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
            <LinearProgress progress={view.getBorrowLimitPercentage} amount={view.getBorrowLimit}/>
          </View>
        </MainInfoHeader>
        <div className="content">
          {view.userSuppliedMarket.length > 0 && (
            <Deposits
              isWithdraw={true}
              hintText={t("hints.balance")}
              title={t("home.walletBalance")}
              data={view.userSuppliedMarket}
              onClick={onBorrowOrSupplyClick}/>
          )}
          <Deposits
            hintText={t("hints.deposits")}
            title={t("deposits.title")}
            data={view.supplyMarket}
            onClick={onBorrowOrSupplyClick}/>
          <Borrows
            data={view.borrowMarket}
            onClick={(item) => onBorrowOrSupplyClick(item, TRANSACTION_TYPE.BORROW)}/>
        </div>
      </div>
    </>
  )
}

export const Home = withStore(HomeViewModel, observer(HomeImpl))
