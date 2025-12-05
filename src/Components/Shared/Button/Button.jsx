import React from "react";
import styled from "styled-components";

const Button = ({ children, className }) => {
  return (
    <StyledWrapper>
      <button className={`btn ${className}`}>{children}</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn {
    color: #875df8;
    text-transform: uppercase;
    text-decoration: none;
    border: 2px solid #875df8;
    padding: 10px 20px;
    font-size: 17px;
    cursor: #875df8;
    font-weight: bold;
    background: transparent;
    position: relative;
    transition: all 1s;
    overflow: hidden;
  }

  .btn:hover {
    color: white;
  }

  .btn::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0%;
    top: 0;
    left: -40px;
    transform: skewX(45deg);
    background-color: #875df8;
    z-index: -1;
    transition: all 1s;
  }

  .btn:hover::before {
    width: 160%;
  }
`;

export default Button;