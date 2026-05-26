import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  to?: string;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

function Button({
  children,
  to,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-7 py-3 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-[#D37E90] text-white shadow-sm hover:bg-[#c56e81]",
    secondary:
      "border border-[#D37E90] bg-transparent text-[#D37E90] hover:bg-[#F5DDE1]",
    ghost: "bg-transparent text-[#D37E90] hover:text-[#b85f72]",
  };

  const width = fullWidth ? "w-full" : "";

  const classes = `${base} ${variants[variant]} ${width} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;