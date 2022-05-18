import React, { useState } from "react";
import { ReactComponent as InfoIcon } from "assets/icons/ic_question.svg";
import Tooltip from "rc-tooltip";
import { View, ViewDirections } from "../ui/view/View";
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

  const ifString = typeof message === "string";

  return (
    <div className={"infoBtn"}>
      <Tooltip
        visible={visible}
        onVisibleChange={setVisible}
        overlay={
          ifString ? (
            <View
              direction={ViewDirections.COLUMN}
              className={"messageContainer"}
            >
              <span className={"message"}>{message}</span>
              <View className={"right"}>
                <span onClick={() => setVisible(false)} className="okBtn">
                  {t("common.clear")}
                </span>
              </View>
            </View>
          ) : (
            message
          )
        }
        trigger="click"
        animation="zoom"
        placement={placement}
      >
        <InfoIcon
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