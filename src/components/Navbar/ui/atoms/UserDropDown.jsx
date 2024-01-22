import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Flex from "../../../core/ui/atoms/Flex";
import { fadeIn, fadeOut } from "./FadeInOut";

const UserDropDown = ({ userSwitchDropdown, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (userSwitchDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, userSwitchDropdown]);

  return (
    <DropdownContainer ref={dropdownRef} visible={userSwitchDropdown}>
      <Arrow />
      <Flex direction="column" fullWidth>
        <TitleWrap>
          <Title>Switch profile</Title>
        </TitleWrap>
        <AddtionalInfo
          alignItems="center"
          fullWidth
          justifyContent="center"
          direction="column"
        >
          <InformationTitle>
            You don't have additional <span>Profiles.</span>
          </InformationTitle>
          <DropDownContentButton alignItems="center">
            <BtnTxt>Click here to add one</BtnTxt>
          </DropDownContentButton>
        </AddtionalInfo>
      </Flex>
    </DropdownContainer>
  );
};

export default UserDropDown;

const DropdownContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 15px;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  max-width: 260px;
  width: 100%;
  min-width: 260px;
  display: ${({ visible }) => (visible ? "block" : "none")};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;

  @media (max-width: 768px) {
    min-width: 240px;
    left: 0;
  }
`;

const DropDownContentButton = styled.div`
  padding: 8px 20px;
  background: rgb(52, 122, 183);
  border-radius: 3px;
`;

const BtnTxt = styled.div`
  font-size: 12px;
  color: #fff;
`;

const InformationTitle = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: rgb(77, 71, 71);

  span {
    color: rgb(51, 122, 183);
  }
`;

const AddtionalInfo = styled(Flex)`
  height: 150px;
  gap: 10px;
`;

const TitleWrap = styled.div`
  width: 100%;
  padding: 10px;
  background: #f2f2f3;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: rgb(77, 71, 71);
`;

const Arrow = styled.div`
  border-width: 11px;
  border-style: solid;
  border-color: transparent transparent rgb(255, 255, 255);
  border-image: initial;
  position: absolute;
  width: 0px;
  height: 0px;
  left: 24.5781px;
  top: -20.5px;
  z-index: 20;
`;
