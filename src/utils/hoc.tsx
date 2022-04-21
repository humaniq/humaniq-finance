import React, { useMemo } from "react";

/**
 * HOC - Wrapper component which provides an instance of view model through props
 * @param Store
 * @param Component
 */
export const withStore =
  (Store: any, Component: any) =>
  ({ ...props }) => {
    const store = useMemo(() => {
      return new Store();
    }, []);

    return <Component view={store} {...props} />;
  };
