"use client";

import { useState } from "react";

import DropdownArrow from "@/icons/arrow-dropdown.svg";

interface Props {
  title: string;
  values?: string[];

  onSelect?: (value: string) => void;
}

const Dropdown: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const isEmpty = !props.values || props.values.length === 0;

  return (
    <div className="flex justify-center text-shade-400">
      <div onMouseLeave={() => setOpen(false)} className="relative">
        <button
          onMouseOver={() => setOpen(true)}
          className={`flex items-center pl-4 pr-3 py-2 bg-shade-200 rounded-md h-10 ${
            open ? "text-primary-100" : ""
          }`}
          onMouseDown={() => {
            if (!props.values || props.values.length === 0) {
              props.onSelect?.(props.title);
            }
          }}
        >
          <h4 className="mr-2">{props.title}</h4>
          {!isEmpty && (
            <DropdownArrow
              className={`fill-primary-100 w-6 h-6 transition-all ${
                open ? "fill-primary-100 rotate-180" : "fill-shade-400"
              }`}
            />
          )}
        </button>
        <ul
          className={`absolute min-w-full max-h-96 overflow-y-auto overflow-x-hidden pl-4 pt-4 pb-2 -mt-[5px] rounded-md space-y-2 bg-shade-200 scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-black-blue ${
            open && !isEmpty ? "block z-10" : "hidden"
          }`}
        >
          {props.values?.map((value, index) => (
            <h4
              key={`dropdown_${props.title}_${index}_value`}
              className="hover:text-primary-100 hover:cursor-pointer whitespace-nowrap mr-4"
              onMouseDown={() => props.onSelect?.(value)}
            >
              {value}
            </h4>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { Dropdown };
