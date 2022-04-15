import React from "react";
import lamp from "../../../assets/images/ic_lamp.svg";
import { Text } from "../text/Text";
import "./HintMessage.style.sass";

export interface HintMessageProps {
  message: string;
  backgroundColor?: string;
}

/**
 * Hint message component
 *
 * @param message
 * @param backgroundColor
 * @constructor
 */
export const HintMessage: React.FC<HintMessageProps> = ({ message }) => {
  return (
    <div className="hint-container">
      <img alt="hint-message" src={lamp} />
      <Text className="text" text={message} />
    </div>
  );
};
