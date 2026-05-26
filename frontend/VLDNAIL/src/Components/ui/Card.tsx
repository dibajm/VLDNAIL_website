import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "pink" | "light" | "white";
};

function Card({ children, className = "", variant = "pink" }: CardProps) {
  const variants = {
    pink: "bg-[#F5DDE1]",
    light: "bg-white/60",
    white: "bg-white",
  };

  return (
    <div className={`rounded-lg ${variants[variant]} p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default Card;