import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[#2f2024]">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-md border border-[#F5DDE1] bg-white/80 px-4 py-3 text-sm text-[#2f2024] outline-none transition placeholder:text-[#b99aa2] focus:border-[#D37E90] focus:ring-2 focus:ring-[#F5DDE1] ${className}`}
        {...props}
      />

      {error && <p className="mt-2 text-xs text-[#D37E90]">{error}</p>}
    </label>
  );
}

export default Input;