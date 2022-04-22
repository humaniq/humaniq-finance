import React from "react";
import "./CalcProgress.style.sass";

export interface CalcProgressProps {
  progress?: number;
  amount?: string;
}

/**
 * LinearProgress
 *
 * @param progress
 * @param amount
 * @constructor
 */
export const CalcProgress: React.FC<CalcProgressProps> = ({
  progress = 60,
  amount,
}) => {
  return (
    <div className="calc-progress-container">
      <div className="calc-progress-row">
        <span className="title">Borrow limit used</span>
        <span className="value">0%</span>
      </div>

      <div className="calc-progress">
        <div
          className="calc-progress-child"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
