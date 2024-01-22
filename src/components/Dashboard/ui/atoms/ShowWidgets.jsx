import React, { useState } from "react";
import styled, { css } from "styled-components";
import Flex from "../../../core/ui/atoms/Flex";
import InputField from "../../../core/ui/atoms/Input";
import NodataLogo from "../assets/NodataLogo";
import { WIDGET_DATA } from "../../api/WidgetsData";
import DropDownIcon from "../../../Navbar/ui/assets/DropdownIcon";
import HomeIcon from "../../../Navbar/ui/assets/HomeIcon";
import { useAppDispatch, useAppSelector } from "../../../core/api/redux/hooks";
import {
  setCreatingWidgetState,
  showWidgetsState,
  updateGeneralState,
} from "../../../core/api/redux/features/generalSlice";
import { useTranslation } from "react-i18next";
import { UpdateWidget } from "../../api/DashboardApi";
import nookies from "nookies";
import { updateDashboardState } from "../../../core/api/redux/features/dashboardSlice";

const ShowWidgets = ({ onWidgetClick, onClose, isCreatingWidget }) => {
  const dispatch = useAppDispatch();

  const { selectedWidget, activeDashboard, layout } = useAppSelector(
    (state) => {
      return {
        selectedWidget: state.general.selectedWidget,
        activeDashboard: state.dashboard.activeDashboard,
        layout: state.dashboard.layout,
      };
    }
  );

  const { t } = useTranslation();
  const { token } = nookies.get({});
  const [errorMessage, setErrorMessage] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [widgetInfo, setWidgetInfo] = useState({
    customWidgetName: selectedWidget?.widgetTitle || "",
    customWidgetData: selectedWidget?.widgetData || "",
  });

  const [openAccordion, setOpenAccordion] = useState(() => {
    if (widgetInfo.customWidgetName || widgetInfo.customWidgetData) {
      return [0, 1];
    }
    return [];
  });

  const handleAccordionClick = (index) => {
    if (openAccordion.includes(index)) {
      setOpenAccordion(openAccordion.filter((item) => item !== index));
    } else {
      setOpenAccordion([...openAccordion, index]);
    }
  };

  const handleWidgetInfoChange = (e) => {
    const { name, value } = e.target;
    setWidgetInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectWidget = (widget) => {
    dispatch(
      updateGeneralState({
        name: "selectedWidget",
        payload: {
          title: widget.title,
          widgetId: widget.widgetId,
        },
      })
    );
    dispatch(setCreatingWidgetState(true));
  };

  const handleCreateWidget = () => {
    if (!widgetInfo.customWidgetName || !widgetInfo.customWidgetData) {
      setErrorMessage(true);
      setTimeout(() => setErrorMessage(false), 2000);
      return;
    }

    const categoryname = selectedWidget.title;

    const textId = widgetInfo.customWidgetName;
    const widgetData = widgetInfo.customWidgetData || null;
    const widgetId = selectedWidget.widgetId;

    onWidgetClick(textId, categoryname, widgetData, widgetId);
    setWidgetInfo({ customWidgetName: "", customWidgetData: "" });
    dispatch(setCreatingWidgetState(false));
    setErrorMessage(false);
    dispatch(
      updateGeneralState({
        name: "selectedWidget",
        payload: null,
      })
    );
    onClose();
  };

  const handleCancelCreate = () => {
    setWidgetInfo({ customWidgetName: "", customWidgetData: "" });
    dispatch(setCreatingWidgetState(false));
    setOpenAccordion([]);
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleUpdateWidget = async () => {
    if (!widgetInfo.customWidgetName || !widgetInfo.customWidgetData) {
      setErrorMessage(true);
      setTimeout(() => setErrorMessage(false), 2000);
      return;
    }

    const dashboardID = activeDashboard.uid;
    const widgetID = selectedWidget.widgetUID;

    const updatedWidgetData = {
      ...selectedWidget,
      widgetTitle: widgetInfo.customWidgetName,
      widgetData: widgetInfo.customWidgetData,
    };

    const resp = await UpdateWidget(
      dashboardID,
      updatedWidgetData,
      token,
      widgetID
    );

    if (resp.status === "success") {
      const parsedProperties = JSON.parse(
        resp.data.properties.replace(/\\/g, "")
      );

      const updatedLayout = layout.map((widget) => {
        if (widget.widgetUID === parsedProperties.widgetUID) {
          return {
            ...widget,
            widgetTitle: parsedProperties.widgetTitle,
            widgetData: parsedProperties.widgetData,
          };
        }
        return widget;
      });
      dispatch(
        updateDashboardState({ name: "layout", payload: updatedLayout })
      );
      dispatch(showWidgetsState(false));
      dispatch(setCreatingWidgetState(false));
      dispatch(
        updateGeneralState({
          name: "selectedWidget",
          payload: null,
        })
      );
    }
  };

  const filteredWidgets = WIDGET_DATA.filter((widget) =>
    widget.title.toLowerCase().startsWith(searchValue.toLowerCase())
  );

  const noData = filteredWidgets.length === 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedWidget?.widgetUID) {
        handleUpdateWidget();
      } else {
        handleCreateWidget();
      }
    }
  };

  return (
    <Container>
      <Wrapper wrap="wrap" fullWidth>
        {!isCreatingWidget && (
          <>
            <SearchInput
              type="text"
              placeholder={t("search_widget_placeholder")}
              value={searchValue}
              onChange={handleSearchInputChange}
            />
            <WidgetData data={noData}>
              {noData ? (
                <NoDataWrap direction="column" alignItems="center" fullWidth>
                  <NodataLogo />
                  <Title>{t("no_widget_found")}</Title>
                </NoDataWrap>
              ) : (
                filteredWidgets.map((widget, index) => (
                  <WidgetSection
                    key={index}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => handleSelectWidget(widget)}
                  >
                    {widget.svglogo}
                    <Title>{t(widget.title)}</Title>
                  </WidgetSection>
                ))
              )}
            </WidgetData>
          </>
        )}
        {isCreatingWidget && (
          <EnterValueWrap fullWidth>
            <StyledFlexx direction="column" fullWidth>
              <CreateWidgetTitle fullWidth>
                {selectedWidget?.widgetCategory
                  ? selectedWidget?.widgetCategory
                  : t(selectedWidget?.title) || t("title")}
              </CreateWidgetTitle>
              <BlockSection fullWidth direction="column">
                <AccordianContent
                  direction="column"
                  fullWidth
                  onClick={() => handleAccordionClick(0)}
                >
                  <AccordianSection
                    fullWidth
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <SideSection alignItems="center">
                      <Flex>
                        <HomeIcon />
                      </Flex>
                      <Flex direction="column">
                        <MainTitle>{t("title")}</MainTitle>
                        <SubTitle>
                          {widgetInfo?.customWidgetName
                            ? widgetInfo.customWidgetName
                            : t("title")}
                        </SubTitle>
                      </Flex>
                    </SideSection>
                    <SideSection open={openAccordion.includes(0)}>
                      <DropDownIcon />
                    </SideSection>
                  </AccordianSection>
                  {openAccordion.includes(0) ? (
                    <InputAccordian fullWidth direction="column">
                      <MainTitle>{t("title")}</MainTitle>
                      <StyledInputField
                        type="text"
                        name="customWidgetName"
                        placeholder={t("enter_widget_name_placeholder")}
                        value={widgetInfo.customWidgetName}
                        onChange={handleWidgetInfoChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </InputAccordian>
                  ) : null}
                </AccordianContent>
                <AccordianContent
                  direction="column"
                  fullWidth
                  onClick={() => handleAccordionClick(1)}
                >
                  <AccordianSection
                    fullWidth
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <SideSection alignItems="center">
                      <Flex>
                        <HomeIcon />
                      </Flex>
                      <Flex direction="column">
                        <MainTitle>{t("data")}</MainTitle>
                        <SubTitle>
                          {widgetInfo?.customWidgetData
                            ? widgetInfo.customWidgetData
                            : t("title")}
                        </SubTitle>
                      </Flex>
                    </SideSection>
                    <SideSection open={openAccordion.includes(1)}>
                      <DropDownIcon />
                    </SideSection>
                  </AccordianSection>
                  {openAccordion.includes(1) ? (
                    <InputAccordian fullWidth direction="column">
                      <MainTitle>Variables</MainTitle>
                      <StyledInputField
                        type="text"
                        name="customWidgetData"
                        placeholder={t("enter_widget_data_placeholder")}
                        value={widgetInfo.customWidgetData}
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleWidgetInfoChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                      />
                    </InputAccordian>
                  ) : null}
                </AccordianContent>
                {errorMessage && (
                  <ErrorMessage>{t("create_widget_err_msg")}</ErrorMessage>
                )}
              </BlockSection>
              <BtnGroup alignItems="center" fullWidth>
                <BtnSection red onClick={handleCancelCreate}>
                  {t("cancel")}
                </BtnSection>
                {selectedWidget.widgetUID ? (
                  <BtnSection onClick={handleUpdateWidget}>
                    {t("edit")}
                  </BtnSection>
                ) : (
                  <BtnSection onClick={handleCreateWidget}>
                    {t("create")}
                  </BtnSection>
                )}
              </BtnGroup>
            </StyledFlexx>
          </EnterValueWrap>
        )}
      </Wrapper>
    </Container>
  );
};

export default ShowWidgets;

const StyledFlexx = styled(Flex)`
  height: 100%;
`;

const InputAccordian = styled(Flex)`
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
`;

const BlockSection = styled(Flex)``;

const MainTitle = styled(Flex)`
  font-size: 15px;
  color: #4c4646;
  text-transform: capitalize;
`;

const SubTitle = styled(Flex)`
  font-size: 12px;
  color: #8c8c8c;
`;

const SideSection = styled(Flex)`
  gap: 10px;

  svg > path {
    fill: #000;
  }

  ${({ open }) =>
    open &&
    css`
      rotate: 180deg;
    `}
`;

const AccordianSection = styled(Flex)`
  background: rgb(255, 255, 255);
  cursor: pointer;
  padding: 10px;
`;

const AccordianContent = styled(Flex)`
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
`;

const WidgetData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  max-height: calc(100vh - 150px);
  overflow: auto;
  height: 100%
    ${({ data }) =>
      data &&
      css`
        overflow: unset;
        display: Flex;
        align-items: center;
        height: calc(100vh - 150px);
      `};
`;

const ErrorMessage = styled.div`
  color: #f00;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const NoDataWrap = styled(Flex)`
  gap: 5px;
`;

const SearchInput = styled(InputField)`
  border: 1px solid #000;
  font-size: 15px;
`;

const StyledInputField = styled(InputField)`
  padding: 9px;
  line-height: 1;
  font-size: 15px;
`;

const BtnGroup = styled(Flex)`
  gap: 5px;
  padding: 5px;
  margin-top: auto;
`;
const BtnSection = styled(Flex)`
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  background: #007d05;
  cursor: pointer;
  color: #fff;
  font-size: 12px;

  ${({ red }) =>
    red &&
    css`
      background: transparent;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: #000;
    `}
`;

const EnterValueWrap = styled(Flex)`
  background: #fff;
  height: calc(100vh - 100px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
`;

const Container = styled(Flex)`
  position: absolute;
  right: 5px;
  top: 50px;
  z-index: 9999;
  background: #fff;
  height: calc(100% - 50px);
  max-width: 310px;
  width: 100%;
`;

const Wrapper = styled(Flex)`
  gap: 5px;
`;

const WidgetSection = styled(Flex)`
  gap: 5px;
  height: 98px;
  border: 1px solid #dbdbdb;
  cursor: pointer;
  background: #fff;

  &:hover {
    background: rgb(245, 245, 245);
  }
`;

const CreateWidgetTitle = styled(Flex)`
  font-size: 20px;
  color: #4c4646;
  padding: 10px;
  text-transform: capitalize;
`;

const Title = styled.div`
  font-size: 12px;
  color: #4c4646;
`;
