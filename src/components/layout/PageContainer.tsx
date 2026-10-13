import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "full";
}

const widths = {
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  full: "max-w-none",
} as const;

export default function PageContainer({
  children,
  className = "",
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10",
        widths[size],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
