import React from "react";
import styled from "styled-components";

const Input = styled.input`
  outline-style: none;
  padding: 8px 12px;
  line-height: 1.25;
  border: 1px solid rgba(0, 0, 0, 0.07);
  transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
  border-radius: 3px;
  color: rgb(31, 32, 35);
  background-color: rgb(252, 252, 252);
  width: 100%;
  font-size: 18px;

  &:focus {
    border: 1px solid rgb(52, 122, 183);
  }
`;

const InputField = ({ type, ...props }) => {
  return <Input type={type} {...props} />;
};

export default InputField;
