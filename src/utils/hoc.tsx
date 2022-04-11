import React, { useMemo } from "react";

export const withStore =
  (Store: any, Component: any) =>
  ({ ...props }) => {
    const store = useMemo(() => {
      return new Store();
    }, []);

    return <Component store={store} {...props} />;
  };
