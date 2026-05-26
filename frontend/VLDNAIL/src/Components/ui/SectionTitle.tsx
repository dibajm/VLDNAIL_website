type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionTitleProps) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={alignment}>
      {eyebrow && (
        <p className="mb-2 font-serif text-xs uppercase tracking-[0.3em] text-[#D37E90]">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-3xl tracking-wide text-[#2f2024]">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6e565d]">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;