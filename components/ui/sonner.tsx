"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      style={
        {
          "--normal-bg": "black",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--font-weight": "500",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
