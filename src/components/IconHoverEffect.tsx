import type { ReactNode } from "react";

type IconHoverEffectProps = {
  children: ReactNode;
  red?: boolean;
};

export function IconHoverEffect({
  children,
  red = false,
}: IconHoverEffectProps) {
  const colorClasses = red
    ? "p-1 outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200"
    : "p-2 outline-gray-400 dark:outline-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 group-hover-bg-gray-200 dark:group-hover-bg-gray-700 group-focus-visible:bg-gray-200 dark:group-focus-visible:bg-gray-700 focus-visible:bg-gray-200 dark:focus-visible:bg-gray-700";

  return (
    <div
      className={`rounded-full transition-colors duration-200 ${colorClasses}`}
    >
      {children}
    </div>
  );
}
