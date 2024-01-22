import React from "react";
import Flex from "../../../core/ui/atoms/Flex";
import styled, { css } from "styled-components";

const DisplayChartSection = ({ widgetData }) => {
  return (
    <DisplayCategory
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <DisplayFlex alignItems="flex-end">
        <DisplayDataInfo>{widgetData}</DisplayDataInfo>
        <DisplayDataInfo small> °F</DisplayDataInfo>
      </DisplayFlex>
      <DisplayFlex>temprature</DisplayFlex>
    </DisplayCategory>
  );
};

export default DisplayChartSection;

const DisplayFlex = styled(Flex)`
  gap: 5px;
`;

const DisplayDataInfo = styled(Flex)`
  font-size: 40px;

  ${({ small }) =>
    small &&
    css`
      font-size: 30px;
    `}
`;

const DisplayCategory = styled(Flex)`
  height: 100%;
`;
