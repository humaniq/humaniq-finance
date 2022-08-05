import "components/transaction-modal/TransactionModal.style.sass"
import ConnectIllustration from "../../assets/images/connect-illustration.svg"
import React, {useMemo} from "react"
import {t} from "translations/translate"
import {LoaderIcon} from "components/transaction-modal/icon/LoaderIcon"
import {Button} from "components/ui/button/Button"
import {observer} from "mobx-react"
import {getProviderStore} from "App"
import {capitalize} from "utils/textUtils"
import {ReactComponent as CircleClose} from "assets/icons/ic_circle_close.svg"
import {TRANSACTION_STATUS, TRANSACTION_STEP, transactionStore} from "stores/app/transactionStore"

interface TransactionModalProps {
  visible?: boolean
  status?: TRANSACTION_STEP
}

export const TransactionModal = observer(({
                                            visible = false,
                                            status = {} as TRANSACTION_STEP
                                          }: TransactionModalProps) => {

  const showScan = useMemo(() => {
    if (
      status.firstStep.status === TRANSACTION_STATUS.SUCCESS &&
      !status.secondStep.status
    ) {
      return true
    }
    return status.firstStep.status === TRANSACTION_STATUS.SUCCESS &&
      status.secondStep.status === TRANSACTION_STATUS.SUCCESS
  }, [status.firstStep.status, status.secondStep.status])

  const showClose = useMemo(() => {
    if (
      status.firstStep.status === TRANSACTION_STATUS.SUCCESS &&
      !status.secondStep.status
    ) {
      return true
    }

    if (
      status.firstStep.status === TRANSACTION_STATUS.SUCCESS &&
      status.secondStep.status === TRANSACTION_STATUS.SUCCESS
    ) {
      return true
    }

    return status.firstStep.status === TRANSACTION_STATUS.ERROR ||
      status.secondStep.status === TRANSACTION_STATUS.ERROR
  }, [status.firstStep.status, status.secondStep.status])

  const showError = useMemo(() => {
    return status.firstStep.status === TRANSACTION_STATUS.ERROR ||
      status.secondStep.status === TRANSACTION_STATUS.ERROR
  }, [status.firstStep.status])

  if (!visible) return null

  return <div className="transaction-modal">
    <div className="modal">
      <img alt="connect-illustration" className="image" src={ConnectIllustration}/>
      <span className="title">{t("transaction.wait")}</span>
      <div className="steps">
        <LoaderIcon
          isLoading={
            Boolean(
              status.firstStep?.status === TRANSACTION_STATUS.PENDING
            )
          }
          isSuccess={
            Boolean(
              status.firstStep?.status === TRANSACTION_STATUS.SUCCESS
            )
          }
          isError={
            Boolean(
              status.firstStep?.status === TRANSACTION_STATUS.ERROR
            )
          }
        />
        <span className="step">{t("transaction.modal.step", {
          step: 1
        })}</span>
        <span className="value">{
          status.firstStep.message || t("transaction.modal.approval")
        }</span>
      </div>
      {status.secondStep.visible && (
        <div className="steps">
          <LoaderIcon
            isLoading={
              Boolean(
                status.secondStep?.status === TRANSACTION_STATUS.PENDING
              )
            }
            isSuccess={
              Boolean(
                status.secondStep?.status === TRANSACTION_STATUS.SUCCESS
              )
            }
            isError={
              Boolean(
                status.secondStep?.status === TRANSACTION_STATUS.ERROR
              )
            }
          />
          <span className="step">{t("transaction.modal.step", {
            step: 2
          })}</span>
          <span className="value">{status.secondStep.message}</span>
        </div>
      )}
      {showScan ? (
        <Button onClick={() => {
          window.location.href = `${getProviderStore.currentNetwork.scanUrl}${transactionStore.transactionHash}`
        }} className="button" text={t("transaction.viewOnScan", {
          network: capitalize(getProviderStore.currentNetwork.type)
        })}/>
      ) : (
        <>
          {showError && (
            <div className="error">
              <span className="error-title">{`${t("common.error")}:`}</span>
              <span
                className="error-message">{transactionStore.transactionMessageStatus.errorMessage || t("transactionMessage.error")}</span>
            </div>
          )}
        </>
      )}
      {showClose && (
        <CircleClose onClick={() => {
          transactionStore.transactionMessageVisible = false
        }} width={22} height={22} className="circle-close"/>
      )}
    </div>
  </div>
})
