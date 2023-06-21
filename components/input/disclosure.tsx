"use client";

import DisclosureArrow from "@/icons/arrow-down.svg";
import React, { CSSProperties } from "react";

import { useState } from "react";

interface Props {
  title: string;

  children?: React.ReactNode;
  style?: CSSProperties | undefined;
}

const Disclosure: React.FC<Props> = ({ title, children, style }) => {
  const [open, setOpen] = useState(false);

  if (React.Children.count(children) === 1) {
    return (
      <div className={`w-full flex flex-col`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col`} style={style}>
      <button
        onMouseDown={() => setOpen(!open)}
        className={`w-full flex items-center justify-between bg-shade-200 rounded-md ${
          open ? "text-primary-100" : ""
        }`}
      >
        <h4 className="mr-2">{title}</h4>
        <DisclosureArrow
          className={`fill-primary-100 w-6 h-6 transition-all ${
            open ? "fill-primary-100 rotate-180" : "fill-shade-400"
          }`}
        />
      </button>
      <div
        className={`w-full mt-3 flex flex-col items-start space-y-6 transition-all ${
          open ? "" : "h-0 hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export { Disclosure };
