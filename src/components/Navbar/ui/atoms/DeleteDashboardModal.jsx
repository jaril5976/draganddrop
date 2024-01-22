import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import Flex from "../../../core/ui/atoms/Flex";
import { useTranslation } from "react-i18next";

const DeleteDashboardModal = ({ onDelete, onClose, value, loading }) => {
  const modalRef = useRef(null);
  const { t } = useTranslation();
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
      <ModalContent alignItems="center" justifyContent="center" fullWidth>
        <Wrap
          ref={modalRef}
          alignItems="center"
          justifyContent="center"
          fullWidth
          direction="column"
        >
          <NameSection direction="column" fullWidth>
            <FieldTitle
              dangerouslySetInnerHTML={{
                __html: t("delete_confirmation", { name: value?.name }),
              }}
            />
          </NameSection>

          <ButtonWrap alignItems="center" justifyContent="center" fullWidth>
            <Button colored onClick={onDelete}>
              {loading ? t("deleting") : t("delete")}
            </Button>
            <Button onClick={onClose}>{t("cancel")}</Button>
          </ButtonWrap>
        </Wrap>
      </ModalContent>
    </Overlay>
  );
};

export default DeleteDashboardModal;

const Button = styled.div`
  cursor: pointer;
  padding: 5px 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f2f3f3;
  }

  ${({ colored }) =>
    colored &&
    css`
      background: rgb(167, 34, 34);
      color: #fff;

      &:hover {
        background: rgb(226, 77, 77);
      }
    `}
`;

const ButtonWrap = styled(Flex)`
  padding: 10px 15px;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const FieldTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: rgb(77, 71, 71);

  span {
    color: #f00;
  }
`;

const NameSection = styled(Flex)`
  padding: 15px;
  gap: 8px;
`;

const Wrap = styled(Flex)`
  background-color: #fff;
  max-height: 500px;
  max-width: 500px;
  border-radius: 5px;

  @media (max-width: 768px) {
    width: 90%;
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
  z-index: 9999;
`;
