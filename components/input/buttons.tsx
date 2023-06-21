"use client";

import { CSSProperties } from "react";

interface ButtonProps {
  text?: string;
  type?: "submit" | "reset" | "button" | undefined;

  children?: React.ReactNode;
  disabled?: boolean;
  preventDefault?: boolean;

  style?: CSSProperties | undefined;

  onClick?: () => void;
}

const SecondaryButton: React.FC<ButtonProps> = (
  { text, type, children, disabled, preventDefault, style, onClick } = {
    preventDefault: true,
  }
) => {
  return (
    <button
      type={type}
      onClick={(e) => {
        if (preventDefault) {
          e.stopPropagation();
          e.preventDefault();
        }

        onClick?.();
      }}
      disabled={disabled}
      style={style}
      className={`transition-all disabled:opacity-25 flex items-center justify-center bg-shade-300 rounded-[10px] hover:bg-gradient-100 active:text-primary-100 active:bg-shade-400 active:bg-none hover:shadow-custom active:shadow-shade-400 hover:shadow-primary-100`}
    >
      {text && <h3>{text}</h3>}
      {children}
    </button>
  );
};

const PrimaryButton: React.FC<ButtonProps> = (
  { text, type, children, disabled, preventDefault, style, onClick } = {
    preventDefault: true,
  }
) => {
  return (
    <button
      type={type}
      onClick={(e) => {
        if (preventDefault) {
          e.stopPropagation();
          e.preventDefault();
        }
        onClick?.();
      }}
      disabled={disabled}
      style={style}
      className={`transition-all bg-gradient-100 disabled:opacity-25 rounded-[10px] enabled:hover:bg-none enabled:hover:bg-primary-300 enabled:hover:text-primary-100 enabled:active:bg-shade-400 enabled:active:text-primary-200 shadow-custom shadow-primary-100 enabled:hover:shadow-none enabled:active:shadow-custom`}
    >
      {text && <h3>{text}</h3>}
      {children}
    </button>
  );
};

export { PrimaryButton, SecondaryButton };
