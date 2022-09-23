import React, {useMemo} from "react"
import colors from "utils/colors"
import "./LinearProgress.style.sass";

export interface LinearProgressProps {
  progress?: number;
  amount: string;
}

/**
 * LinearProgress component
 *
 * @param progress
 * @param amount
 * @constructor
 */
export const  LinearProgress: React.FC<LinearProgressProps> = ({
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

  const handleProgress = useMemo(() => progress === 0 ? 0 : Math.min(progress, 100), [progress])
  const handleProgressPercentage = useMemo(() => progress === 0 ? 0 : handleProgress, [progress, handleProgress])

  return (
    <div className="progress-container">
      <div className="progress">
        <div className="child" style={{
          width: `${handleProgressPercentage}%`,
          backgroundColor: progressColor,
        }}/>
        <span className="text">{`${handleProgress.toFixed(handleProgress === 0 ? 0 : 2)}%`}</span>
      </div>
      <span className="amount">{amount}</span>
    </div>
  );
};
