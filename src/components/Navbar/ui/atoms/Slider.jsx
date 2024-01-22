import React, { Fragment, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import PlusIcon from "../assets/PlusIcon";
import AddDashBoardModal from "../../../Dashboard/ui/atoms/AddDashBoardModal";
import Flex from "../../../core/ui/atoms/Flex";
import EditIcon from "../assets/EditIcon";
import DeleteIcon from "../assets/DeleteIcon";
import nookies from "nookies";
import DeleteDashboardModal from "./DeleteDashboardModal";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useAppDispatch, useAppSelector } from "../../../core/api/redux/hooks";
import { updateDashboardState } from "../../../core/api/redux/features/dashboardSlice";
import {
  DeleteDashboard,
  DisplayWidgetByDashboardID,
  fetchAllDashboard,
} from "../../../Dashboard/api/DashboardApi";

import {
  showWidgetsState,
  updateGeneralState,
} from "../../../core/api/redux/features/generalSlice";
import { useTranslation } from "react-i18next";

const Slider = ({ isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = nookies.get({});
  const location = useLocation();
  const langParam = location.pathname.split("/")[1] || "pt";

  const [showAddDashBoardModal, setShowAddDashBoardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { alldashboard, activeDashboard, selectedDashboard, uneditMode } =
    useAppSelector((state) => {
      return {
        alldashboard: state.dashboard.alldashboard,
        activeDashboard: state.dashboard.activeDashboard,
        selectedDashboard: state.dashboard.selectedDashboard,
        uneditMode: state.general.uneditMode,
      };
    });

  useEffect(() => {
    activeDashboard && fetchWidget(activeDashboard?.uid);
  }, []);

  const handleDashboardModal = () => {
    dispatch(showWidgetsState(false));
    setShowAddDashBoardModal(true);
  };

  const hideDashBoardModal = () => {
    setShowAddDashBoardModal(false);
    dispatch(
      updateDashboardState({ name: "selectedDashboard", payload: null })
    );
  };

  const handleOpenDelete = (item) => () => {
    dispatch(
      updateDashboardState({ name: "selectedDashboard", payload: item })
    );
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    dispatch(
      updateDashboardState({ name: "selectedDashboard", payload: null })
    );
    setShowDeleteModal(false);
  };

  const handleEdit = (item) => () => {
    dispatch(
      updateDashboardState({ name: "selectedDashboard", payload: item })
    );
    setShowAddDashBoardModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const response = await DeleteDashboard(selectedDashboard.uid, token);

    if (response) {
      const updatedDashboards = alldashboard?.filter(
        (dashboard) => dashboard.uid !== selectedDashboard.uid
      );
      handleCloseDelete();
      setDeleteLoading(false);

      if (updatedDashboards.length === 0) {
        dispatch(
          updateDashboardState({ name: "activeDashboard", payload: null })
        );
      }
      dispatch(updateDashboardState({ name: "layout", payload: [] }));

      updatedDashboards.length > 0 && fetchWidget(updatedDashboards[0]?.uid);

      navigate(`/${langParam}/dashboard/${updatedDashboards[0]?.uid}`);

      dispatch(
        updateDashboardState({
          name: "alldashboard",
          payload: updatedDashboards,
        })
      );

      dispatch(
        updateDashboardState({
          name: "activeDashboard",
          payload: updatedDashboards[0],
        })
      );
    }
    return;
  };

  const fetchAll = async () => {
    const resp = await fetchAllDashboard(token);
    if (resp?.data?.length > 0) {
      dispatch(
        updateDashboardState({
          name: "alldashboard",
          payload: resp?.data,
        })
      );
      dispatch(
        updateDashboardState({
          name: "activeDashboard",
          payload: resp?.data[0],
        })
      );
      navigate(`/${langParam}/dashboard/${resp?.data[0]?.uid}`);
      fetchWidget(resp?.data[0]?.uid);
    }
  };

  useEffect(() => {
    activeDashboard === null && fetchAll();
  }, []);

  useEffect(() => {
    if (alldashboard?.length === 0) {
      navigate(`/${langParam}/dashboard`);
    }
  }, [alldashboard]);

  const handleDashboardClick = debounce((item) => {
    if (item.uid !== activeDashboard.uid) {
      dispatch(
        updateGeneralState({
          name: "isLoading",
          payload: true,
        })
      );
      dispatch(showWidgetsState(false));

      navigate(`/${langParam}/dashboard/${item.uid}`);
      dispatch(
        updateDashboardState({
          name: "activeDashboard",
          payload: item,
        })
      );
      dispatch(
        updateDashboardState({
          name: "layout",
          payload: [],
        })
      );
      fetchWidget(item.uid);
    }
  }, 500);

  const fetchWidget = async (dashboardID) => {
    const resp = await DisplayWidgetByDashboardID(dashboardID, token);

    if (resp?.data?.length > 0) {
      const updatedData = resp.data.map((item) => {
        const parsedProperties = JSON.parse(item.properties.replace(/\\/g, ""));
        item.properties = { ...parsedProperties, widgetUID: item.uid };
        return item;
      });

      const layoutProperties = updatedData.map((item) => item.properties);
      dispatch(
        updateDashboardState({
          name: "layout",
          payload: layoutProperties,
        })
      );
    }
    dispatch(
      updateGeneralState({
        name: "isLoading",
        payload: false,
      })
    );
  };

  return (
    <Fragment>
      <SliderContainer isOpen={isOpen}>
        <DashBoardInformation direction="column">
          <DashBoardDetails
            fullWidth
            direction="column"
            justifyContent="center"
          >
            <Flex alignItems="center" fullWidth justifyContent="space-between">
              <Title>{t("dashboard")}</Title>
              {!uneditMode && (
                <AddIcon onClick={handleDashboardModal}>
                  <PlusIcon />
                </AddIcon>
              )}
            </Flex>
          </DashBoardDetails>
          <DashboardNameSection direction="column" fullWidth>
            {alldashboard?.map((item, index) => (
              <DashboardFlex
                fullWidth
                justifyContent="space-between"
                key={index}
                active={activeDashboard?.uid === item.uid}
              >
                <DashboardName onClick={() => handleDashboardClick(item)}>
                  {item.name}
                </DashboardName>
                {!uneditMode && (
                  <DashboardName svg>
                    <SvgFlex onClick={handleOpenDelete(item)}>
                      <DeleteIcon />
                    </SvgFlex>
                    <SvgFlex onClick={handleEdit(item)}>
                      <EditIcon />
                    </SvgFlex>
                  </DashboardName>
                )}
              </DashboardFlex>
            ))}
          </DashboardNameSection>
        </DashBoardInformation>
      </SliderContainer>
      {showAddDashBoardModal && (
        <AddDashBoardModal
          onClose={hideDashBoardModal}
          initialValues={selectedDashboard}
          langParam={langParam}
        />
      )}
      {showDeleteModal && (
        <DeleteDashboardModal
          value={selectedDashboard}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
          loading={deleteLoading}
        />
      )}
    </Fragment>
  );
};

export default Slider;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0%);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
`;

const DashBoardInformation = styled(Flex)`
  background: #fff;
`;

const SvgFlex = styled(Flex)`
  display: none;
`;

const DashboardFlex = styled(Flex)`
  padding: 8px 10px;
  border: 1px solid #dbdbdb;
  color: rgb(77, 71, 71);
  cursor: pointer;
  background: rgb(242, 242, 243);

  &:hover {
    ${SvgFlex} {
      display: flex;
    }
    background: #d9dadb;
  }

  ${({ active }) =>
    active &&
    css`
      background: #c1c2c3;

      &:hover {
        background: #c1c2c3;
      }
    `}
`;

const DashboardNameSection = styled(Flex)`
  gap: 3px;
`;

const DashboardName = styled.div`
  color: #000;
  font-size: 13px;
  width: 100%;
  ${({ svg }) =>
    svg &&
    css`
      display: flex;
      gap: 10px;
      width: unset;

      svg {
        cursor: pointer;
      }
    `}
`;

const AddIcon = styled.div`
  color: rgb(77, 71, 71);
  cursor: pointer;
`;

const Title = styled.div`
  color: #00000080;
  letter-spacing: 1.2px;
  font-size: 14px;
  line-height: 1;
  font-weight: bold;
  font-weight: 700;
  text-transform: uppercase;
`;

const DashBoardDetails = styled(Flex)`
  padding: 0 8px;
  height: 36px;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
`;

const SliderContainer = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  background: #fff;
  max-width: 270px;
  width: 100%;
  max-height: 100%;
  min-height: calc(100% - 45px);
  display: flex;
  flex-direction: column;
  z-index: 9;
  gap: 5px;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.3s alternate;
  box-shadow: rgba(0, 0, 0, 0.2) 3px 0px 15px 0px;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;
