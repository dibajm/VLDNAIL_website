import type { InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
};

function Checkbox({ label, helperText, className = "", ...props }: CheckboxProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border border-[#F5DDE1] bg-white/70 p-3 text-sm transition hover:border-[#D37E90] ${className}`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[#D37E90]"
        {...props}
      />

      <span>
        <span className="block font-medium text-[#2f2024]">{label}</span>

        {helperText && (
          <span className="mt-1 block text-xs text-[#7c6269]">
            {helperText}
          </span>
        )}
      </span>
    </label>
  );
}

export default Checkbox;