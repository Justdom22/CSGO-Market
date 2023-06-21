"use client";

import { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";

interface SearchBoxProps {
  children?: React.ReactNode;
  style?: CSSProperties | undefined;

  onChange?: (value: string) => void;
  onSubmit?: (text: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ children, style, onChange, onSubmit }) => {
  const [value, setValue] = useState("");

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit?.(value);
    }
  };

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  return (
    <div className="bg-transparent rounded-[10px] p-[2px] focus-within:bg-gradient-200 transition-all delay-75">
      <div className={`rounded-[10px] pl-5 flex items-center`} style={style}>
        <Image src="/icons/search.svg" width={24} height={24} alt={""} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleEnter}
          className="ml-3 w-full bg-transparent outline-none"
          type="text"
          placeholder="Search..."
        ></input>

        {children}
      </div>
    </div>
  );
};

export { SearchBox };
