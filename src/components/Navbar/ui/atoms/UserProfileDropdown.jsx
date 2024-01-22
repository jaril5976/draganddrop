import React from "react";
import styled, { css } from "styled-components";
import { fadeIn, fadeOut } from "./FadeInOut";
import Flex from "../../../core/ui/atoms/Flex";
import { destroyCookie } from "nookies";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserProfileDropdown = ({ userProfileDropdown, dropdownRef }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const langParam = location.pathname.split("/")[1] || "pt";

  const handleLogout = () => {
    destroyCookie({}, "token", { path: "/" });
    navigate(`/${langParam}/`);
  };

  return (
    <DropdownContainer visible={userProfileDropdown} ref={dropdownRef}>
      <Arrow />
      <Flex direction="column" fullWidth>
        <UserInfoWrapper fullWidth direction="column">
          <Name>{t("username")}</Name>
          <Name email>example123@gmail.com</Name>
        </UserInfoWrapper>
        <BottomSection alignItems="center" justifyContent="flex-end" fullWidth>
          <ActionWrapper onClick={handleLogout}>{t("logout")}</ActionWrapper>
        </BottomSection>
      </Flex>
    </DropdownContainer>
  );
};

export default UserProfileDropdown;

const BottomSection = styled(Flex)`
  padding: 10px;
`;

const ActionWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 3px;
  color: #000;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 99999;
  max-width: 365px;
  width: 100%;
  min-width: 365px;
  border: 1px solid rgb(204, 204, 204);
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;
  border-radius: 3px;
  display: ${({ visible }) => (visible ? "block" : "none")};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.3s ease-in-out;

  @media (max-width: 768px) {
    min-width: 250px;
  }
`;

const UserInfoWrapper = styled(Flex)`
  padding: 8px;
  background: #f2f2f3;
  border-bottom: 1px solid rgb(225, 225, 225);
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: rgb(77, 71, 71);

  ${({ email }) =>
    email &&
    css`
      font-weight: normal;
      color: rgb(150, 150, 150);
    `}
`;

const Arrow = styled.div`
  border-width: 11px;
  border-style: solid;
  border-color: transparent transparent rgb(255, 255, 255);
  border-image: initial;
  position: absolute;
  width: 0px;
  height: 0px;
  right: 0;
  top: -22px;
  z-index: 20;
`;
