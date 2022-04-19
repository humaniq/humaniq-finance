import React from "react";
import { CalcViewModel } from "./CalcViewModel";
import { withStore } from "../../utils/hoc";
import { observer } from "mobx-react";
import { Header } from "../../components/header/Header";
import { TokenItem } from "../../components/main/token/TokenItem";
import { CalcForm } from "./form/CalcForm";

import "./Calc.style.sass";

export interface CalcScreenProps {
  view: CalcViewModel;
}

const CalcImpl: React.FC<CalcScreenProps> = ({ view }) => {
  return (
    <div className="calc-screen-container">
      <Header title="Deposit WBTC" />
      <div className="content">
        <TokenItem
          showButton={false}
          title="Wrapped BTC"
          subTitle="WBTC"
          amount="$200"
          subAmount="0.0047"
        />
        <CalcForm />
      </div>
    </div>
  );
};

export const Calc = withStore(CalcViewModel, observer(CalcImpl));
