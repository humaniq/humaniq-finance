import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { MainInfoHeader } from "../../components/main/MainInfoHeader";
import { Space } from "../../ui/Space";
import { Text } from "../../ui/Text";

export const Main = observer(() => {
  const { t } = useTranslation();

  return (
    <div className="main">
      <MainInfoHeader>
        <Space style={{ padding: 20 }}>
          <Text text={"test"} />
        </Space>
      </MainInfoHeader>
    </div>
  );
});
