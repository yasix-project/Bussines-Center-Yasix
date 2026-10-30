import Logo from "../../assets/Logo Segi Lima.png";

/**
 * Logo BC Yasix (SVG inline, tanpa file gambar).
 *
 * variant : "icon" = perisai saja | "full" = perisai + tulisan
 * theme   : "light" = untuk latar terang | "dark" = untuk latar gelap (panel bg-dark)
 * size    : tinggi ikon dalam px (tulisan menyesuaikan otomatis)
 * tagline : tampilkan "SMK YADIKA 6 JATIWARINGIN" di bawah nama (hanya variant "full")
 */
export default function BCYasixLogo({
  variant = "full",
  theme = "light",
  size = 48,
  tagline = true,
  className = "",
}) {
  const dark = theme === "dark";

  const icon = <img src={Logo} alt="Logo BC Yasix" />;

  if (variant === "icon") {
    return (
      <span className={className} style={{ display: "inline-flex" }}>
        {icon}
      </span>
    );
  }

  const nameSize = Math.round(size * 0.62);
  const tagSize = Math.max(8, Math.round(size * 0.17));

  return (
    <div
      className={className}
      role="img"
      aria-label="Logo BC Yasix"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.25),
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {icon}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: Math.round(size * 0.08),
        }}
      >
        <div
          style={{
            fontSize: nameSize,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: dark ? "#FFFFFF" : "#0B2D6B",
          }}
        >
          <span style={{ fontWeight: 800 }}>BC</span>{" "}
          <span
            style={{ fontWeight: 500, color: dark ? "#8DB8FF" : "#1F5FC2" }}
          >
            Yasix
          </span>
        </div>
        {tagline && (
          <div
            style={{
              fontSize: tagSize,
              letterSpacing: "0.22em",
              fontWeight: 500,
              color: dark ? "#C3D3EE" : "#4A5568",
              whiteSpace: "nowrap",
            }}
          >
            SMK YADIKA 6 JATIWARINGIN
          </div>
        )}
      </div>
    </div>
  );
}
