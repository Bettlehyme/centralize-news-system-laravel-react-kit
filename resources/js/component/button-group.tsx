import clsx from "clsx";
import React, { useState, useEffect } from "react";

interface ButtonItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ButtonGroupProps {
  items: ButtonItem[];
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string; // controlled value
  orientation?: "vertical" | "horizontal";
  scrollable?: boolean;
  className?: string; // container styles
  buttonClassName?: string; // new: per-button styles
}

export default function ButtonGroup({
  items,
  onChange,
  defaultValue,
  value,
  orientation = "vertical",
  scrollable = true,
  className,
  buttonClassName,
}: ButtonGroupProps) {
  const [active, setActive] = useState<string>(
    value || defaultValue || items[0]?.value
  );

  // Keep in sync if parent controls it
  useEffect(() => {
    if (value !== undefined) {
      setActive(value);
    }
  }, [value]);

  const handleClick = (val: string) => {
    if (value === undefined) {
      setActive(val);
    }
    onChange?.(val);
  };

  const containerClass = clsx(
    "rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md scrollbar-hide",
    {
      "flex flex-col p-2 space-y-2": orientation === "vertical",
      "flex flex-row p-2 space-x-2": orientation === "horizontal",
      "h-64 overflow-y-auto": orientation === "vertical" && scrollable,
      "w-[90vw] overflow-x-auto justify-center":
        orientation === "horizontal" && scrollable,
    },
    className
  );

  return (
    <div className={clsx(containerClass, "relative")}>
      <div
        className={clsx(
          "flex",
          orientation === "horizontal"
            ? "flex-row space-x-2 px-5 overflow-x-auto scrollbar-hide"
            : "flex-col space-y-2 overflow-y-auto scrollbar-hide"
        )}
      >
        {items.map((item) => {
          const buttonClass = clsx(
            "flex items-center h-8 rounded-full px-4 py-2 whitespace-nowrap transition-colors",
            {
              "bg-blue-500 text-white": active === item.value,
              "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700":
                active !== item.value,
            },
            buttonClassName // 🔥 apply custom button styles
          );

          return (
            <button
              key={item.value}
              onClick={() => handleClick(item.value)}
              className={buttonClass}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          );
        })}

        {/* Fade overlays */}
        {orientation === "horizontal" && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />
          </>
        )}
        {orientation === "vertical" && (
          <>
            <div className="pointer-events-none absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white dark:from-gray-900 to-transparent z-10" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10" />
          </>
        )}
      </div>
    </div>
  );
}
