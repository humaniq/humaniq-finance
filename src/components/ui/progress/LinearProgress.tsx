import React from "react";
import "./LinearProgress.style.sass";

export interface LinearProgressProps {
  progress?: number;
  amount: string;
}

/**
 * LinearProgress
 *
 * @param progress
 * @param amount
 * @constructor
 */
export const LinearProgress: React.FC<LinearProgressProps> = ({
  progress = 0,
  amount,
}) => {
  return (
    <div className="progress-container">
      <div className="progress" style={{ marginLeft: progress > 0 ? 0 : 10 }}>
        <div className="child" style={{ width: `${progress}%` }}>
          <span className="text">{`${progress}%`}</span>
        </div>
      </div>
      <span className="amount">{amount}</span>
    </div>
  );
};
