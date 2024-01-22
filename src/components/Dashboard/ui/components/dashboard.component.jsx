import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import GridLayout from "react-grid-layout";
import ShowWidgets from "../atoms/ShowWidgets";
import Flex from "../../../core/ui/atoms/Flex";
import Navbar from "../../../Navbar/ui/components/navbar.component";
import { ExitFullScreen, FullScreenLogo } from "../assets/ToggleScreenView";
import Moreinfo from "../assets/Moreinfo";
import MenuDropdown from "../atoms/MenuDropdown";
import { v4 as uuidv4 } from "uuid";
import PieChartSection from "../atoms/PieChartSection";
import LineChartSection from "../atoms/LineChartSection";
import AngularChartSection from "../atoms/AngularChartSection";
import CylinderChart from "../atoms/CylinderChart";
import DisplayChartSection from "../atoms/DisplayChartSection";
import nookies from "nookies";
import { useLocation, useNavigate } from "react-router-dom";
import { AddWidget, DeleteWidget, UpdateWidget } from "../../api/DashboardApi";
import Loading from "../../../core/ui/atoms/Loading";
import { useAppDispatch, useAppSelector } from "../../../core/api/redux/hooks";
import {
  deleteWidgetState,
  updateDashboardState,
  widgetDragState,
  widgetResizeState,
} from "../../../core/api/redux/features/dashboardSlice";
import {
  setCreatingWidgetState,
  setUneditModeState,
  showWidgetsState,
  updateGeneralState,
} from "../../../core/api/redux/features/generalSlice";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const langParam = location.pathname.split("/")[1] || "pt";
  const {
    sliderOpen,
    uneditMode,
    showWidgets,
    isLoading,
    layout,
    activeDashboard,
    isCreatingWidget,
  } = useAppSelector((state) => {
    return {
      sliderOpen: state.general.sliderOpen,
      uneditMode: state.general.uneditMode,
      showWidgets: state.general.showWidgets,
      isLoading: state.general.isLoading,
      layout: state.dashboard.layout,
      activeDashboard: state.dashboard.activeDashboard,
      isCreatingWidget: state.general.isCreatingWidget,
    };
  });

  const { token } = nookies.get({});
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    !token && navigate(`/${langParam}/sso`);
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleDragStop = async (dragdropLayout, oldElm, newElm) => {
    if (!uneditMode) {
      const activeWidget = layout.find((k) => k.i === newElm.i);
      let obj = {
        ...newElm,
        widgetCategory: activeWidget.widgetCategory,
        widgetTitle: activeWidget.widgetTitle,
        widgetUID: activeWidget.widgetUID,
        widgetData: activeWidget.widgetData,
      };

      await UpdateWidget(
        activeDashboard?.uid,
        obj,
        token,
        activeWidget?.widgetUID
      );
      dispatch(widgetDragState(obj));
    }
  };

  const handleSize = async (resizeLayout, oldElm, newElm) => {
    if (!uneditMode) {
      const activeWidget = layout.find((k) => k.i === newElm.i);
      let obj = {
        ...newElm,
        widgetCategory: activeWidget.widgetCategory,
        widgetTitle: activeWidget.widgetTitle,
        widgetUID: activeWidget.widgetUID,
        widgetData: activeWidget.widgetData,
      };

      await UpdateWidget(
        activeDashboard?.uid,
        obj,
        token,
        activeWidget?.widgetUID
      );
      dispatch(widgetResizeState(obj));
    }
  };

  const handleWidgetClick = async (
    widgetTitle,
    widgetCategory,
    widgetData,
    widgetId
  ) => {
    dispatch(
      updateGeneralState({
        name: "isLoading",
        payload: true,
      })
    );
    if (widgetTitle && !uneditMode) {
      const data = {
        i: uuidv4(),
        x: 0,
        y: 0,
        h: 9,
        w: 3,
        minW: 2,
        minH: 2,
        widgetCategory,
        widgetTitle,
        widgetData,
        widgetId,
      };

      const dashboardID = activeDashboard.uid;
      const resp = await AddWidget(dashboardID, data, token, widgetId);
      if (resp && resp.data) {
        const parsedProperties = JSON.parse(
          resp.data.properties.replace(/\\/g, "")
        );
        const updatedData = {
          ...resp.data,
          properties: { ...parsedProperties, widgetUID: resp.data.uid },
        };

        dispatch(
          updateGeneralState({
            name: "isLoading",
            payload: false,
          })
        );
        const updatedLayout = [...layout, updatedData.properties];
        dispatch(
          updateDashboardState({ name: "layout", payload: updatedLayout })
        );
      }
    }
  };

  const handleUneditToggle = () => {
    dispatch(setUneditModeState(!uneditMode));
    dispatch(showWidgetsState(false));
  };

  const handleEditWidget = (component) => {
    dispatch(showWidgetsState(true));
    dispatch(setCreatingWidgetState(true));
    dispatch(
      updateGeneralState({
        name: "selectedWidget",
        payload: component,
      })
    );
  };

  const handleDeleteWidget = (dashboardID, widgetUID) => async () => {
    const data = {
      widgetUID,
    };
    const resp = await DeleteWidget(dashboardID, token, widgetUID);
    if (resp && resp.status === "success") {
      dispatch(deleteWidgetState(data));
    }
    handleCloseDropdown();
  };

  const handleOpenDropdown = (index) => (e) => {
    e.stopPropagation();
    setOpenDropdownIndex(index);
    dispatch(showWidgetsState(false));
  };

  const handleCloseDropdown = () => setOpenDropdownIndex(null);

  const handleToggleWidget = () => {
    dispatch(showWidgetsState(!showWidgets));
    dispatch(
      updateGeneralState({
        name: "selectedWidget",
        payload: null,
      })
    );
    dispatch(setCreatingWidgetState(false));
  };

  return (
    <Container direction="column" fullWidth>
      <Navbar />
      <Wrapper
        className={isFullscreen ? "fullscreen" : ""}
        alignItems="center"
        isOpen={sliderOpen}
        direction="column"
        fullWidth
        uneditMode={uneditMode}
      >
        <WidgetInfo fullWidth alignItems="center">
          <Button darkIcon>{activeDashboard?.name}</Button>
          <StyleFlex alignItems="center">
            {isLoading && <Loading />}
            {!uneditMode && activeDashboard && (
              <Button onClick={handleToggleWidget}>
                {showWidgets ? t("close_widget") : t("add_widget")}
              </Button>
            )}
            <Button onClick={handleUneditToggle}>
              {uneditMode ? t("enable_edit") : t("disable_edit")}
            </Button>
            <Button onClick={toggleFullscreen}>
              {!isFullscreen ? <FullScreenLogo /> : <ExitFullScreen />}
            </Button>
          </StyleFlex>
        </WidgetInfo>
        {showWidgets && (
          <ShowWidgets
            onWidgetClick={handleWidgetClick}
            onClose={handleToggleWidget}
            isCreatingWidget={isCreatingWidget}
          />
        )}
        <LayoutWrapper>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={width}
            onDragStop={handleDragStop}
            onResizeStop={handleSize}
            isResizable={!uneditMode}
            isDraggable={!uneditMode}
            verticalCompact={false}
            preventCollision={true}
          >
            {layout.map((component, index) => {
              const { i, widgetCategory, widgetData, widgetUID } = component;
              return (
                <MainDiv key={i} data-grid={layout[index]}>
                  <LayoutTitle>
                    {(widgetCategory === "angular" ||
                      widgetCategory === "pie" ||
                      widgetCategory === "display") && (
                      <LayoutTitle>{component?.widgetTitle}</LayoutTitle>
                    )}
                  </LayoutTitle>
                  {!uneditMode && (
                    <Btn onClick={handleOpenDropdown(index)}>
                      <Moreinfo />
                    </Btn>
                  )}
                  {openDropdownIndex === index && (
                    <MenuDropdown
                      onEditWidget={() => handleEditWidget(component)}
                      onDeleteWidget={handleDeleteWidget(
                        activeDashboard?.uid,
                        widgetUID
                      )}
                      onClose={handleCloseDropdown}
                    />
                  )}
                  {widgetCategory === "map" && (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1457084952!2d72.71637788381209!3d19.082177516721558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700469363204!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      title="map"
                    />
                  )}
                  {widgetCategory === "display" && (
                    <DisplayChartSection widgetData={widgetData} />
                  )}
                  {widgetCategory === "cylinder" && (
                    <CylinderChart widgetData={widgetData} />
                  )}
                  {widgetCategory === "image" && (
                    <StyledImageSection widgetData={widgetData} />
                  )}
                  {widgetCategory === "line" && (
                    <LineChartSection widgetData={widgetData} />
                  )}
                  {widgetCategory === "pie" && (
                    <PieChartSection widgetData={widgetData} />
                  )}
                  {widgetCategory === "angular" && (
                    <AngularChartSection widgetData={widgetData} />
                  )}
                </MainDiv>
              );
            })}
          </GridLayout>
        </LayoutWrapper>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;

const StyledImageSection = styled(Flex)`
  background-size: contain;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.widgetData});
`;

const LayoutTitle = styled.div`
  position: absolute;
  width: 100%;
`;

const LayoutWrapper = styled.div`
  min-height: calc(100vh - 88px);
  max-height: calc(100vh - 88px);
  overflow: auto;
  width: 100%;

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(194, 194, 194);
  }

  &::-webkit-scrollbar {
    background: transparent;
    width: 8px;
    height: 8px;
  }
`;

const MainDiv = styled.div`
  position: relative;
  background-size: contain;
  background-position: center;
  padding: 10px;
`;

const Btn = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  z-index: 9;
`;

const StyleFlex = styled(Flex)`
  gap: 10px;
  margin-left: auto;
`;

const Button = styled(Flex)`
  font-size: 12px;
  color: #000;
  cursor: pointer;

  ${({ darkIcon }) =>
    darkIcon &&
    css`
      font-size: 15px;
      font-weight: bold;
    `}
`;

const WidgetInfo = styled(Flex)`
  padding: 10px;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;

  .react-grid-layout {
    max-height: calc(100vh - 90px);
    min-width: 100%;
    width: 100%;
  }
`;

const Wrapper = styled(Flex)`
  margin: 0;
  position: relative;
  min-height: calc(100vh - 45px);
  background-size: 20px 20px;
  background-position: 0px 0px, 30px 30px;
  overflow-x: hidden;
  background-image: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0) 24%,
      transparent 25%,
      transparent 75%,
      rgba(0, 0, 0, 0.04) 75%
    ),
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.04) 24%,
      transparent 25%,
      transparent 75%
    );

  ${({ isOpen }) =>
    isOpen &&
    css`
      max-width: calc(100% - 270px);
      margin-left: 270px;

      @media (max-width: 768px) {
        margin: 0;
        max-width: unset;
      }
    `}

  .layout {
    width: 100%;
  }

  .react-grid-item {
    background-color: #fff;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
    cursor: all-scroll;
    border-radius: 5px;

    ${({ uneditMode }) =>
      uneditMode &&
      css`
        cursor: unset;
      `}
  }
`;

const Container = styled(Flex)`
  min-height: 100vh;
`;
