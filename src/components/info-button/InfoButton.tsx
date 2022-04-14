import React, { useState, FC } from "react";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import "./styles.sass";
import Tooltip from "rc-tooltip";
import "./tolltip.sass";
import { View, ViewDirections } from "../ui/view/View";
import { t } from "i18next";

export enum PLACEMENT {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}

export interface InfoButtonProps {
  message: string | React.ReactElement;
  placement?: PLACEMENT;
}

/**
 * Info button component
 *
 * @param message
 * @param placement
 * @constructor
 */
export const InfoButton: FC<InfoButtonProps> = ({
  message = "",
  placement = PLACEMENT.RIGHT,
}) => {
  const [visible, setVisible] = useState(false);

  const ifString = typeof message === "string";

  return (
    <div className={"infoBtn"}>
      <Tooltip
        visible={visible}
        onVisibleChange={(val) => setVisible(val)}
        overlay={
          ifString ? (
            <View
              direction={ViewDirections.COLUMN}
              className={"messageContainer"}
            >
              <View className={"message"}>{message}</View>
              <View className={"right"}>
                <span onClick={() => setVisible(false)} className="okBtn">
                  {t<string>("general.ok")}
                </span>
              </View>
            </View>
          ) : (
            message
          )
        }
        trigger={"click"}
        animation="zoom"
        placement={placement}
      >
        <InfoIcon
          width={14}
          height={14}
          color={"white"}
          style={{ opacity: 0.5 }}
        />
      </Tooltip>
    </div>
  );
};
