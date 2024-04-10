import React from "react";

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  text: string;
  padding?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  disabledClassName?: string;
  isLeft?: boolean;
  children?: React.ReactNode;
};

const Button = ({
  className = "",
  onClick = () => {},
  text,
  padding = "px-4 py-2",
  disabled = false,
  type = "button",
  disabledClassName = className,
  isLeft = false,
  children,
}: ButtonProps) => {
  return (
    <button
      className={
        disabled ? padding + " " + disabledClassName : padding + " " + className
      }
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {isLeft ? children : null}
      {text}
      {!isLeft ? children : null}
    </button>
  );
};

export default Button;
