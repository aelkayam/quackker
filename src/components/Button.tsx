import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  gray?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({
  small = false,
  gray = false,
  className = "",
  ...props
}: ButtonProps) {
  const sizeClasses = small ? "px-2 py-1" : " px-4 py 2 font-bold";
  const coloClasses = gray
    ? "bg-gray-400 hover:bg-gray-300 focus-visible: bg-gray-300"
    : "bg-yellow-500 hover:bg-yellow-400 focus-visible: bg-yellow-400";

  return (
    <button
      className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 
      ${sizeClasses} ${coloClasses} ${className}`}
      {...props}
    ></button>
  );
}
