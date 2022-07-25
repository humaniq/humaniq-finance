import React, {useMemo} from "react"
import colors from "utils/colors"
import "./TransactionLinearProgress.style.sass"

export interface TransactionLinearProgressProps {
  progress: number;
  amount?: string;
}

/**
 * Transaction LinearProgress
 *
 * @param progress
 * @param amount
 * @constructor
 */
export const TransactionLinearProgress: React.FC<TransactionLinearProgressProps> = ({
                                                                                      progress = 0
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

  const handleProgress = useMemo(() => Math.min(progress, 100), [progress])

  return (
    <div className="tx-progress-container">
      <div className="tx-progress">
        <div
          className="tx-progress-child"
          style={{width: `${handleProgress}%`, backgroundColor: progressColor}}
        />
      </div>
    </div>
  )
}
