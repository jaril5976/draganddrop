// src/components/LanguageSwitcher.jsx

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Flex from "./core/ui/atoms/Flex";
import styled from "styled-components";

const LanguageSwitcher = ({ onClose }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef(null);
  const { t } = useTranslation();

  const changeLanguage = (language) => () => {
    i18n.changeLanguage(language);
    const newPath = location.pathname.replace(/^\/[a-z]{2}/, `/${language}`);
    navigate(newPath);
    onClose();
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Overlay alignItems="center" justifyContent="center">
      <ModalContent alignItems="center" fullWidth justifyContent="center">
        <Wrap
          alignItems="center"
          justifyContent="center"
          fullWidth
          direction="column"
          ref={modalRef}
        >
          <MainTitle>{t("chose_language")}</MainTitle>
          <LangWrap>
            <Btn onClick={changeLanguage("en")}>English</Btn>
            <Btn onClick={changeLanguage("es")}>Spanish</Btn>
            <Btn onClick={changeLanguage("pt")}>Portuguese</Btn>
          </LangWrap>
        </Wrap>
      </ModalContent>
    </Overlay>
  );
};

export default LanguageSwitcher;

const MainTitle = styled.div`
  font-size: 25px;
  font-family: "Bold";
`;

const LangWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  width: 100%;
  place-items: center;
`;

const Wrap = styled(Flex)`
  background-color: #fff;
  max-height: 700px;
  max-width: 500px;
  gap: 25px;
  border-radius: 10px;
  padding: 20px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Btn = styled.div`
  cursor: pointer;
  color: #000;
  &:hover {
    color: #444;
  }
`;

const ModalContent = styled(Flex)`
  position: relative;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
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
