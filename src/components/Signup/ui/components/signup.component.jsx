import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import CloseEye from "../../../core/ui/assets/CloseEye";
import OpenEye from "../../../core/ui/assets/OpenEye";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Flex from "../../../core/ui/atoms/Flex";
import InputField from "../../../core/ui/atoms/Input";

const Signup = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
    country: {},
  });

  const [formErrors, setFormErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    company: null,
    country: null,
    checkbox: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? !formData[name] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const handleSignup = () => {
    const errors = {};
    let isValid = true;

    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = "This field is required";
        isValid = false;
      } else {
        errors[key] = "";
      }
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    if (!formData.checkbox) {
      errors.checkbox = "Please agree to the Terms & Conditions";
      setFormErrors(errors);
      return;
    }

    setFormErrors({
      ...formErrors,
      checkbox: "",
    });

    // const updatedFormData = {
    //   ...formData,
    //   country: selectedCountry,
    // };

    navigate("/sso");
  };

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      });
  }, []);

  return (
    <Container alignItems="center" justifyContent="center">
      <Wrapper direction="column" alignItems="center" fullWidth>
        <TopicTitle fullwidth>Sign up</TopicTitle>
        <InputWrapper direction="column" fullWidth>
          <InfoSection column>
            <Section direction="column">
              <InputTitle>First name</InputTitle>
              <InputField
                autoComplete="off"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {formErrors.firstName && (
                <ErrorMessage>{formErrors.firstName}</ErrorMessage>
              )}
            </Section>
            <Section direction="column">
              <InputTitle>Last name</InputTitle>
              <InputField
                autoComplete="off"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {formErrors.lastName && (
                <ErrorMessage>{formErrors.lastName}</ErrorMessage>
              )}
            </Section>
          </InfoSection>
          <InfoSection>
            <Section direction="column">
              <InputTitle>Email</InputTitle>
              <InputField
                autoComplete="off"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <ErrorMessage>{formErrors.email}</ErrorMessage>
              )}
            </Section>
          </InfoSection>
          <InfoSection border>
            <Section direction="column" position>
              <InputTitle>Password</InputTitle>
              <InputField
                autoComplete="off"
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <PasswordToggle onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <CloseEye /> : <OpenEye />}
              </PasswordToggle>
              {formErrors.password && (
                <ErrorMessage>{formErrors.password}</ErrorMessage>
              )}
            </Section>
          </InfoSection>
          <InfoSection>
            <Section direction="column">
              <InputTitle>Company</InputTitle>
              <InputField
                autoComplete="off"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
              {formErrors.company && (
                <ErrorMessage>{formErrors.company}</ErrorMessage>
              )}
            </Section>
          </InfoSection>
          <InfoSection>
            <Section direction="column">
              <InputTitle>Country</InputTitle>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
              />
              {formErrors.country && (
                <ErrorMessage>{formErrors.country}</ErrorMessage>
              )}
            </Section>
          </InfoSection>
        </InputWrapper>
        <BottomWrap alignItems="center" fullWidth direction="column">
          <StyledFlex fullWidth>
            <StyledInputAtom
              type="checkbox"
              name="checkbox"
              checked={formData.checkbox}
              onChange={handleInputChange}
            />
            <TextWrap>
              I agree with the <span>Terms & Conditions.</span>
            </TextWrap>
          </StyledFlex>
          {formErrors.checkbox && (
            <ErrorMessage>{formErrors.checkbox}</ErrorMessage>
          )}
          <ButtonWrapper
            alignItems="center"
            justifyContent="center"
            fullWidth
            onClick={handleSignup}
          >
            <SiginButton>Sign up</SiginButton>
          </ButtonWrapper>
          <AlreadyUser>
            Already have an account?{" "}
            <span onClick={() => navigate("/sso")}>Sign in.</span>
          </AlreadyUser>
        </BottomWrap>
      </Wrapper>
    </Container>
  );
};

export default Signup;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
`;

const AlreadyUser = styled.div`
  text-align: center;
  color: rgb(77, 71, 71);
  font-size: 16px;

  span {
    color: rgb(52, 122, 183);
    cursor: pointer;
  }
`;

const StyledFlex = styled(Flex)`
  gap: 5px;
`;

const ButtonWrapper = styled(Flex)`
  cursor: pointer;
  max-width: 280px;
`;

const SiginButton = styled.div`
  color: rgb(255, 255, 255);
  background-color: rgb(52, 122, 183);
  font-size: 19px;
  padding: 12px;
  border-radius: 3px;
  line-height: 17px;
  text-align: center;
  min-width: 280px;

  @media (max-width: 768px) {
    min-width: 90%;
  }
`;

const StyledInputAtom = styled(InputField)`
  width: unset;
  cursor: pointer;
`;

const TextWrap = styled.div`
  color: rgb(77, 71, 71);
  font-size: 13px;

  span {
    color: rgb(52, 122, 183);
    cursor: pointer;
  }
`;

const BottomWrap = styled(Flex)`
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const PasswordToggle = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 58%;
`;

const InputTitle = styled.div`
  color: rgb(77, 71, 71);
  width: 100%;
`;

const Section = styled(Flex)`
  gap: 7px;
  width: 100%;

  .css-b62m3t-container {
    width: 100%;
  }

  ${({ position }) =>
    position &&
    css`
      position: relative;
    `}
`;

const InfoSection = styled(Flex)`
  gap: 10px;
  width: 100%;

  ${({ column }) =>
    column &&
    css`
      @media (max-width: 550px) {
        flex-direction: column;
      }
    `}

  ${({ border }) =>
    border &&
    css`
      @media (min-width: 768px) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 30px;
      }
    `}
`;

const InputWrapper = styled(Flex)`
  gap: 28px;

  @media (max-width: 550px) {
    gap: 15px;
  }
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
  gap: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
    gap: 20px;
  }
`;

const Container = styled(Flex)`
  min-height: 100vh;
  background: #fff;
`;
