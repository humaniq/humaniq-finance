import React, {useMemo} from "react"
import colors from "utils/colors"
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

  const progressColor = useMemo(() => {
    if (progress > 0 && progress < 30) {
      return colors.purpleHeart
    } else if (progress >= 30 && progress < 50) {
      return colors.orangeWarning
    } else if (progress >= 50 && progress <= 80) {
      return colors.redAlert
    }
    return ""
  }, [progress])

  const handleProgress = useMemo(() => Math.min(progress, 100).toFixed(2), [progress])

  return (
    <div className="progress-container">
      <div className="progress" style={{ marginLeft: progress > 0 ? 0 : 10 }}>
        <div className="progress-child" style={{ width: `${handleProgress}%`, backgroundColor: progressColor }}>
          <span className="progress-text">{`${handleProgress}%`}</span>
        </div>
      </div>
      <span className="amount">{amount}</span>
    </div>
  );
};
