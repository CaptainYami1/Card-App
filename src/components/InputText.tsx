import { useState, type ChangeEvent, type ReactNode } from "react";

type InputTextProps = {
  className?: string;
  label?: ReactNode;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  type?: string;
  disabled?: boolean;
  max?: number;
};

export const InputText = ({
  className,
  label,
  value,
  onChange,
  defaultValue = "",
  readOnly = false,
  placeholder,
  name,
  max,
  id,
  type = "text",
  disabled = false,
}: InputTextProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled && !readOnly) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const inputValue = readOnly
    ? value || "—"
    : isControlled
      ? value
      : internalValue;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
      {label && (
        <label
          htmlFor={id}
          className="mb-2.5 text-[14px]  leading-3 align-middle text-[#111827]"
        >
          {label}
        </label>
      )}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        className="w-full rounded-[10px] border border-[#E9EAEB] bg-white p-4 font-sora text-[12px] placeholder:text-[#AAAAAA] text-[#242424] outline-none focus:border-[#242424]  disabled:cursor-not-allowed disabled:opacity-60 read-only:cursor-default"
        value={inputValue ?? ""}
        max={max}
        onChange={readOnly ? undefined : handleChange}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};
