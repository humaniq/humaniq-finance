import React from "react";
import { ReactComponent as MaxIcon } from "../../../assets/icons/ic_max.svg";
import { ReactComponent as ChangeIcon } from "../../../assets/icons/ic_change.svg";
import { Button } from "../../../components/ui/button/Button";
import { CalcProgress } from "../progress/CalcProgress";
import "./ValuationForm.style.sass";
import { ReactComponent as ArrowRightIcon } from "../../../assets/icons/ic_arrow_right.svg";

export interface CalcFormProps {}

export const ValuationForm: React.FC<CalcFormProps> = ({}) => {
  return (
    <div className="calc-form">
      <span className="title">USD</span>
      <div className="middle-row">
        <div className="calc-icon-container">
          <MaxIcon width={32} height={32} className="calc-icon" />
        </div>
        <input className="input" placeholder="0" />
        <div className="calc-icon-container">
          <ChangeIcon width={26} height={26} />
        </div>
      </div>
      <span className="title">0 WBTC</span>
      <Button className="fee-btn" text="Slow fee $10.00" />

      <div className="calc-row">
        <span className="title">Deposit % per year</span>
        <span className="value">2.70%</span>
      </div>

      <div className="calc-row">
        <span className="title">Borrow limit</span>
        <span className="value">$0.00</span>
      </div>

      <CalcProgress />

      <div className="calc-row">
        <span className="title">Borrow limit</span>
        <div className="right-row">
          <span className="value">$10.00</span>
          <ArrowRightIcon width={20} height={20} className="arrow-icon" />
          <span className="value">$120.00</span>
        </div>
      </div>

      <Button className="calc-btn" text="Deposit $0.00" />
    </div>
  );
};