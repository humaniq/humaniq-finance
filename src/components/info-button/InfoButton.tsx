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
  backgroundColor?: string
}

/**
 * Info button component
 *
 * @param message
 * @param placement
 * @param color
 * @param size
 * @param backgroundColor
 * @constructor
 */
export const InfoButton: React.FC<InfoButtonProps> = ({
                                                        message = "",
                                                        placement = PLACEMENT.RIGHT,
                                                        color = "white",
                                                        size = 15,
                                                        backgroundColor,
                                                      }) => {
  const [visible, setVisible] = useState(false);
  const arrowRef = useRef<any>(50)
  const containerRef = useRef<any>(0)

  return (
    <div className={"infoBtn"}>
      <Tooltip
        onPopupAlign={(node, align: any) => {
          const arrowElement = node.querySelector<any>(".rc-tooltip-arrow")
          const width = arrowRef.current?.getBoundingClientRect().width
          const containerWidth = containerRef.current?.getBoundingClientRect().width

          if (backgroundColor) {
            const innerElement = node.querySelector<any>(".rc-tooltip-inner")
            innerElement.style.backgroundColor = backgroundColor
            arrowElement.style.borderTopColor = backgroundColor
            arrowElement.style.borderBottomColor = backgroundColor
          }

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
          typeof message === "string" ? (
            <div
              ref={containerRef}
              className={"messageContainer"}
            >
              <span className={"message"}>{message}</span>
              <View className={"right"}>
                <span onClick={() => setVisible(false)} className={`okBtn ${backgroundColor ? "borrow" : ""}`}>
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
