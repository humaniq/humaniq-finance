import React, {useRef, useState} from "react"
import { ReactComponent as InfoIcon } from "assets/icons/ic_question.svg";
import Tooltip from "rc-tooltip";
import { View } from "../ui/view/View";
import { t } from "translations/translate";
import "./styles.sass";
import "./tolltip.sass";

export enum PLACEMENT {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}

export interface InfoButtonProps {
  message: string | React.ReactElement;
  placement?: PLACEMENT;
  color?: string;
  size?: number;
}

/**
 * Info button component
 *
 * @param message
 * @param placement
 * @param color
 * @param size
 * @constructor
 */
export const InfoButton: React.FC<InfoButtonProps> = ({
                                                        message = "",
                                                        placement = PLACEMENT.RIGHT,
                                                        color = "white",
                                                        size = 15,
                                                      }) => {
  const [visible, setVisible] = useState(false);
  const arrowRef = useRef<any>(50)
  const containerRef = useRef<any>(0)

  const ifString = typeof message === "string";

  return (
    <div className={"infoBtn"}>
      <Tooltip
        onPopupAlign={(node, align: any) => {
          const arrowElement = node.querySelector<any>(".rc-tooltip-arrow")
          const width = arrowRef.current?.getBoundingClientRect().width
          const containerWidth = containerRef.current?.getBoundingClientRect().width

          const xOffset = arrowRef.current?.getBoundingClientRect().x + width / 2
          if (xOffset >= containerWidth / 2) {
            arrowElement.style.left = `50%`
          } else {
            arrowElement.style.left = `${Math.floor(xOffset)}px`
          }
        }}
        visible={visible}
        onVisibleChange={setVisible}
        overlay={
          ifString ? (
            <div
              ref={containerRef}
              className={"messageContainer"}
            >
              <span className={"message"}>{message}</span>
              <View className={"right"}>
                <span onClick={() => setVisible(false)} className="okBtn">
                  {t("common.clear")}
                </span>
              </View>
            </div>
          ) : (
            message
          )
        }
        trigger="click"
        animation="zoom"
        placement={placement}
      >
        <InfoIcon
          ref={arrowRef}
          className="info-icon"
          width={size}
          height={size}
          color={color}
          style={{ opacity: 0.5 }}
        />
      </Tooltip>
    </div>
  );
};