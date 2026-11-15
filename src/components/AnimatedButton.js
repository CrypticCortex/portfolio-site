'use client';
import styled from '@emotion/styled';
import { useEffect } from 'react';

const ButtonContainer = styled.div`
  --width: 100%;
  --time: 0.7s;

  position: relative;
  display: inline-block;
  padding: 1em 2em; /* Adjust padding to ensure button has enough space */
  color: white;
  background: #222;
  overflow: hidden;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  line-height: 1.5;

  text {
    position: relative;
    z-index: 1; /* Ensure text is above the ripple */
    transition: color var(--time);
    display: inline-block;
  }

  &:hover text {
    color: #222; /* Change text color to black on hover */
  }

  span {
    position: absolute;
    display: block;
    z-index: 0;
    width: 0;
    height: 0;
    border-radius: 100%;
    background: #fff;
    transform: translate(-50%, -50%);
    transition: width var(--time), padding-top var(--time);
    left: 50%;
    top: 50%;
  }

  &:hover span {
    width: calc(var(--width) * 2.25);
    padding-top: calc(var(--width) * 2.25);
  }

  &.FLASH:hover text {
    color: white;
  }

  &.FLASH span {
    background: #ff3b3b;
  }

  &.animated {
    --angle: 5deg;
    animation: shake 0.3s;
  }

  @keyframes shake {
    25% {
      transform: rotate(calc(var(--angle) * -1));
    }

    50% {
      transform: rotate(var(--angle));
    }

    100% {
      transform: rotate(0deg);
    }
  }
`;


const AnimatedButton = ({ children, flash }) => {
  useEffect(() => {
    const ANIMATEDCLASSNAME = "animated";
    const ELEMENTS = document.querySelectorAll(".HOVER");
    const ELEMENTS_SPAN = [];

    ELEMENTS.forEach((element, index) => {
      let addAnimation = false;
      if (element.classList.contains("FLASH")) {
        element.addEventListener("animationend", e => {
          element.classList.remove(ANIMATEDCLASSNAME);
        });
        addAnimation = true;
      }

      if (!ELEMENTS_SPAN[index])
        ELEMENTS_SPAN[index] = element.querySelector("span");

      element.addEventListener("mouseover", e => {
        ELEMENTS_SPAN[index].style.left = e.pageX - element.offsetLeft + "px";
        ELEMENTS_SPAN[index].style.top = e.pageY - element.offsetTop + "px";

        if (addAnimation) element.classList.add(ANIMATEDCLASSNAME);
      });

      element.addEventListener("mouseout", e => {
        ELEMENTS_SPAN[index].style.left = e.pageX - element.offsetLeft + "px";
        ELEMENTS_SPAN[index].style.top = e.pageY - element.offsetTop + "px";
      });
    });
  }, []);

  return (
    <ButtonContainer className={`HOVER ${flash ? 'FLASH' : ''}`}>
      <span></span>
      <text>{children}</text>
    </ButtonContainer>
  );
};

export default AnimatedButton;
