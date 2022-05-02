import React, { useCallback } from "react";
import { ValuationViewModel } from "./ValuationViewModel";
import { withStore } from "../../utils/hoc";
import { observer } from "mobx-react";
import { Header } from "../../components/header/Header";
import { TokenItem } from "../../components/main/token/TokenItem";
import { ValuationForm } from "./form/ValuationForm";
import { useNavigate } from "react-router-dom";
import "./Valuation.style.sass";

export interface CalcScreenProps {
  view: ValuationViewModel;
}

const ValuationImpl: React.FC<CalcScreenProps> = ({ view }) => {
  const navigate = useNavigate();

  const onClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="calc-screen">
      <Header title="Deposit WBTC" onClose={onClose} />
      <div className="calc-screen-content">
        <TokenItem
          showButton={false}
          title="Wrapped BTC"
          subTitle="WBTC"
          amount="$200"
          subAmount="0.0047"
        />
        <ValuationForm />
      </div>
    </div>
  );
};

export const Valuation = withStore(ValuationViewModel, observer(ValuationImpl));
