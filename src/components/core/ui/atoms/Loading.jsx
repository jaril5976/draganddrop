import React from "react";
import styled from "styled-components";

const Loading = () => {
  return <Loader />;
};

export default Loading;

const Loader = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
`;
