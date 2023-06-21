"use client";

import { useEffect, useState } from "react";

interface Props {
  label: string;
  value: string;

  onSubmit?: (value: string, checked: boolean) => void;
}

const Checkbox: React.FC<Props> = ({label, value, onSubmit }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    onSubmit?.(value, isChecked);
  }, [isChecked]);

  return (
    <div
      className="flex items-center cursor-pointer"
      onMouseDown={() => {
        setIsChecked(!isChecked);
      }}
    >
      <div className="w-6 h-6 bg-shade-100 rounded border border-shade-300 p-1">
        {isChecked && (
          <div className="w-full h-full rounded bg-gradient-100 shadow-custom shadow-primary-100"></div>
        )}
      </div>
      <span className="text-body-1 text-white ml-3">{label}</span>
    </div>
  );
};

export { Checkbox };
