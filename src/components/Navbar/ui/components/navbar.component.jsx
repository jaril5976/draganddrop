import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import MenuIcon from "../assets/MenuIcon";
import DropDownIcon from "../assets/DropdownIcon";
import UserProfileDropdown from "../atoms/UserProfileDropdown";
import Slider from "../atoms/Slider";
import Flex from "../../../core/ui/atoms/Flex";
import { toggleSliderState } from "../../../core/api/redux/features/generalSlice";
import { useAppDispatch, useAppSelector } from "../../../core/api/redux/hooks";
import useOutsideClick from "../../../core/api/hooks/useOutsideClick";
import LanguageSwitcher from "../../../LanguageSwitcher";
import Language from "../assets/Language";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const sliderOpen = useAppSelector((state) => state.general.sliderOpen);
  const ignoreRef = useRef(null);
  const dropdownRef = useRef(null);
  const [userProfileDropdown, setUserProfileDropdown] = useState(false);

  const [showLangModal, setShowLangModal] = useState(false);

  const toogleUserProfileDropdown = () => {
    setUserProfileDropdown(!userProfileDropdown);
  };

  const toggleSlider = () => {
    dispatch(toggleSliderState(!sliderOpen));
  };

  const handleShowLang = () => {
    setShowLangModal(true);
  };

  const handleCloseLang = () => {
    setShowLangModal(false);
  };

  useOutsideClick(
    dropdownRef,
    () => {
      setUserProfileDropdown(false);
    },
    [dropdownRef],
    [ignoreRef]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && sliderOpen) {
        dispatch(toggleSliderState(false));
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sliderOpen]);

  return (
    <Container fullWidth justifyContent="space-between" alignItems="center">
      <Section alignItems="center">
        <SvgWrap onClick={toggleSlider}>
          <MenuIcon />
        </SvgWrap>
      </Section>
      <Section extraGap alignItems="center">
        <SvgWrap lang onClick={handleShowLang}>
          <Language />
        </SvgWrap>
        <UserInfo
          alignItems="center"
          onClick={toogleUserProfileDropdown}
          ref={ignoreRef}
        >
          <UserImage />
          <SvgWrap>
            <DropDownIcon />
          </SvgWrap>
          {userProfileDropdown && (
            <UserProfileDropdown
              userProfileDropdown={userProfileDropdown}
              dropdownRef={dropdownRef}
            />
          )}
        </UserInfo>
      </Section>
      {showLangModal && <LanguageSwitcher onClose={handleCloseLang} />}
      {sliderOpen && <Slider isOpen={sliderOpen} />}
    </Container>
  );
};

export default Navbar;

const UserInfo = styled(Flex)`
  gap: 5px;
  cursor: pointer;
  position: relative;
`;

const UserImage = styled.img`
  background: url("/static/images/userImg.jpg") center no-repeat;
  height: 32px;
  width: 50px;
  cursor: pointer;
  border-radius: 5px;
  background-size: cover;
`;

const Section = styled(Flex)`
  gap: 10px;

  ${({ extraGap }) =>
    extraGap &&
    css`
      gap: 15px;
    `}
`;

const SvgWrap = styled(Flex)`
  cursor: pointer;

  ${({ lang }) =>
    lang &&
    css`
      path {
        fill: #fff;
      }
    `}
`;

const Container = styled(Flex)`
  background: rgb(52, 122, 183);
  padding: 5px 20px;
  min-height: 45px;
  box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
`;
