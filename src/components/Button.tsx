import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-[#30444F] text-white enabled:hover:bg-[#30444F]/90 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#30444F80]",
  outline: "bg-transparent border border-[#30444F] text-[#30444F] enabled:hover:bg-[#30444F]/10 enabled:active:scale-[0.99] disabled:cursor-not-allowed ",
  ghost: "bg-transparent disabled:cursor-not-allowed  text-[#30444F] hover:bg-[#30444F]/10 hover:text-[#30444F]/90",
  danger: "border border-red-500 text-red-500 hover:text-red-700 hover:border-red-700 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:border-red-500/50",
};

type ButtonVariant = keyof typeof variants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children?: ReactNode;
};

export const Button = ({
  variant = "primary",
  onClick,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full w-full px-5 py-3.5 text-sm font-semibold transition cursor-pointer inline-flex items-center justify-center ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
