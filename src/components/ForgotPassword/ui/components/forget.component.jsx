import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import InputField from "../../../core/ui/atoms/Input";
import Flex from "../../../core/ui/atoms/Flex";

const Forgotpasswordmodal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose();
    navigate("/sso");
  };
  return (
    <Container alignItems="center" justifyContent="center" fullWidth>
      <Wrapper direction="column" alignItems="center" fullWidth>
        <TopicTitle>Forgot your password?</TopicTitle>
        <TopicDesc>
          Enter your email address to reset your password. You may need to check
          your spam folder.
        </TopicDesc>
        <InputWrap direction="column" fullWidth>
          <Section direction="column" fullWidth>
            <InputField type="text" autoComplete="off" placeholder="e-mail" />
          </Section>
        </InputWrap>
        <ButtonWrap>
          <ButtonTxt>Reset password</ButtonTxt>
        </ButtonWrap>
        <LinkWrap onClick={handleRedirect}>Go back to Sign in</LinkWrap>
      </Wrapper>
    </Container>
  );
};

export default Forgotpasswordmodal;

const LinkWrap = styled.div`
  text-align: center;
  color: rgb(52, 122, 183);
  font-size: 16px;
  cursor: pointer;
`;

const ButtonTxt = styled.div`
  color: rgb(255, 255, 255);
  font-size: 19px;
  font-weight: 500;
  line-height: 17px;
  text-align: center;
`;

const ButtonWrap = styled.div`
  background-color: rgb(52, 122, 183);
  max-width: 280px;
  padding: 12px;
  border-radius: 3px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const TopicDesc = styled.div`
  color: #4c4646;
  font-size: 13px;
  text-align: center;
`;

const Section = styled(Flex)`
  gap: 7px;
`;

const InputWrap = styled(Flex)`
  gap: 15px;
`;

const TopicTitle = styled(Flex)`
  font-size: 25px;
  color: rgb(77, 71, 71);
  font-weight: bold;
`;

const Wrapper = styled(Flex)`
  box-shadow: rgba(0, 0, 0, 0.07) 0px 2px 8px 0px;
  max-width: 500px;
  padding: 20px;
  background: rgb(255, 255, 255);
  gap: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Container = styled(Flex)`
  min-height: 100vh;
  background: #fff;
`;
