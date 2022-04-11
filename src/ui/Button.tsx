import React from "react";

export interface ButtonProps {
  text: string;
  color: string;
  onClick: () => void;
}

export const Button = ({ text, onClick, color }: ButtonProps) => {
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}>
      {text}
    </button>
  );
};
