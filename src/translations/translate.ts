import { t as rootT } from "i18next";

export const t = (key: string, options?: any): string =>
  rootT<string>(key, options);
