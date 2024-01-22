import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Flex from "../../../core/ui/atoms/Flex";
import InputField from "../../../core/ui/atoms/Input";
import { AddDashboard, UpdateDashboard } from "../../api/DashboardApi";
import nookies from "nookies";
import { useNavigate } from "react-router-dom";
import { updateDashboardState } from "../../../core/api/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../../../core/api/redux/hooks";
import { showWidgetsState } from "../../../core/api/redux/features/generalSlice";
import { useTranslation } from "react-i18next";

const AddDashBoardModal = ({ onClose, initialValues, langParam }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { token } = nookies.get({});
  const { t } = useTranslation();

  const { alldashboard, activeDashboard } = useAppSelector((state) => {
    return {
      alldashboard: state.dashboard.alldashboard,
      activeDashboard: state.dashboard.activeDashboard,
    };
  });

  const initialState = {
    name: initialValues ? initialValues.name : "",
  };

  const [field, setField] = useState(initialState);
  const [errMsg, setErrMsg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField({ ...field, [name]: value });
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    setField({ name: initialValues ? initialValues.name : "" });

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [initialValues]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreateOrUpdateDashboard();
    }
  };

  const addDashboard = async () => {
    const resp = await AddDashboard(field, token);

    if (!alldashboard || alldashboard.length === 0) {
      dispatch(
        updateDashboardState({ name: "activeDashboard", payload: resp.data })
      );
      navigate(`/${langParam}/dashboard/${resp?.data?.uid}`);

      dispatch(
        updateDashboardState({
          name: "alldashboard",
          payload: [resp.data],
        })
      );
    } else {
      dispatch(
        updateDashboardState({
          name: "alldashboard",
          payload: [...alldashboard, resp.data],
        })
      );
    }
  };

  const updateDashboard = async () => {
    const resp = await UpdateDashboard(initialValues.uid, field, token);
    const updatedDashboards = alldashboard.map((dashboard) =>
      dashboard.uid === initialValues.uid ? resp.data : dashboard
    );
    dispatch(
      updateDashboardState({ name: "alldashboard", payload: updatedDashboards })
    );
    if (activeDashboard.uid === initialValues.uid) {
      dispatch(
        updateDashboardState({ name: "activeDashboard", payload: resp.data })
      );
    }
  };

  const handleCreateOrUpdateDashboard = () => {
    if (!field.name) {
      setErrMsg(true);
      setTimeout(() => {
        setErrMsg(false);
      }, 2000);
      return;
    }
    initialValues ? updateDashboard() : addDashboard();
    onClose();
    dispatch(showWidgetsState(false));
  };

  return (
    <Overlay alignItems="center" justifyContent="center">
      <ModalContent alignItems="center" fullWidth justifyContent="center">
        <Wrap
          ref={modalRef}
          alignItems="center"
          justifyContent="center"
          fullWidth
          direction="column"
        >
          <UpperSection alignItems="center" fullWidth>
            <Title>
              {initialValues ? t("update") : t("add")} {t("dashboard")}
            </Title>
          </UpperSection>
          <NameSection direction="column" fullWidth>
            <FieldTitle>{t("name")}</FieldTitle>
            <StyledInputField
              type="text"
              name="name"
              value={field.name}
              placeholder={t("name_of_dashboard_placeholder")}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              autoComplete="off"
            />
            {errMsg && <ErrMsg>*{t("add_dashboard_err_msg")}</ErrMsg>}
          </NameSection>
          <ButtonWrap
            alignItems="center"
            justifyContent="space-between"
            fullWidth
          >
            <Button onClick={onClose}>{t("cancel")}</Button>
            <Button colored onClick={handleCreateOrUpdateDashboard}>
              {initialValues ? t("update_dashboard") : t("create_dashboard")}
            </Button>
          </ButtonWrap>
        </Wrap>
      </ModalContent>
    </Overlay>
  );
};

export default AddDashBoardModal;

const ErrMsg = styled.div`
  color: #f00;
  font-weight: bold;
`;

const Button = styled.div`
  cursor: pointer;
  padding: 5px 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  ${({ colored }) =>
    colored &&
    css`
      background: rgb(178, 16, 121);
      border: 1px solid rgb(178, 16, 121);
      color: #fff;
    `}
`;

const ButtonWrap = styled(Flex)`
  padding: 10px 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const FieldTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: rgb(77, 71, 71);
`;

const StyledInputField = styled(InputField)`
  font-size: 12px;
`;

const NameSection = styled(Flex)`
  padding: 15px;
  gap: 8px;
`;

const Title = styled.div`
  color: rgb(255, 255, 255);
  font-weight: bold;
  font-size: 20px;
`;

const UpperSection = styled(Flex)`
  padding: 20px;
  background: rgb(178, 16, 121);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
  gap: 10px;
`;

const ModalContent = styled(Flex)`
  position: relative;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
`;

const Wrap = styled(Flex)`
  background-color: #fff;
  max-height: 500px;
  max-width: 700px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999999999;
`;
