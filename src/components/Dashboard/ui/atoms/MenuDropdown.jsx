import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const MenuDropdown = ({ onClose, onDeleteWidget, onEditWidget }) => {
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleDoEdit = () => {
    onClose();
    onEditWidget();
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <Button onClick={handleDoEdit}>{t("edit")}</Button>
      <Button onClick={onDeleteWidget}>{t("delete")}</Button>
    </DropdownContainer>
  );
};

export default MenuDropdown;

const DropdownContainer = styled.div`
  display: flex;
  position: absolute;
  top: 40px;
  right: -30px;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
  z-index: 1;
  flex-direction: column;
  z-index: 100;
`;

const Button = styled.div`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #000;

  &:hover {
    color: red;
  }
`;
