// src/components/NotFound/PageNotFound.jsx

import React from "react";
import styled from "styled-components";
import Flex from "../core/ui/atoms/Flex";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();

  return <Container>{t("page_not_found")}</Container>;
};

export default PageNotFound;

const Container = styled(Flex)`
  height: 100vh;
  max-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;
