import React from "react";

type PillProps = {
  className?: string;
  type: "success" | "error" | "warning" | "inactive";
  text: string;
  isLoading?: boolean;
};

const Pill = ({ className = "", type, text }: PillProps) => {
  return (
    <div
      style={{
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
      }}
      className={
        "px-3 rounded-full text-sm " +
        className +
        " " +
        (type === "success"
          ? "bg-success text-success-dark"
          : type === "error"
          ? "bg-error text-error-dark"
          : type === "inactive"
          ? "bg-white text-black"
          : "bg-warning text-warning-dark")
      }
    >
      {text}
    </div>
  );
};

export default Pill;
