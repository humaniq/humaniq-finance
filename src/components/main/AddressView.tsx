import React from "react";

export interface AddressViewProps {
  title: string;
  onClick?: () => void;
  style?: any;
}

export const AddressView = ({
  title,
  onClick,
  style = {},
}: AddressViewProps) => {
  return (
    <button
      style={{
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderColor: "#fff",
        color: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 14,
        paddingRight: 14,
        fontSize: 18,
        ...style,
      }}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
