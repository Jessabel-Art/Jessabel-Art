import type { CSSProperties } from "react";
const paths = {
  arrow: "M5 12h14m-5-5 5 5-5 5",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  cart: "M2 3h3l3 13h11l3-9H6M9 21h.01M19 21h.01",
  user: "M20 21v-2a7 7 0 0 0-14 0v2zM16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "m6 6 12 12M6 18 18 6",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6",
  truck:
    "M1 4h13v13H1zM14 9h5l4 5v3h-9M8 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0M21 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  box: "m12 2 10 5v11l-10 5-10-5V7zM2 7l10 5 10-5M12 12v11M7 4.5l10 5",
  bulb: "M9 18h6M9 22h6M8 15a7 7 0 1 1 8 0l-1 3H9z",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",
  check: "m5 12 4 4L19 6",
  mail: "M2 4h20v16H2zM2 4l10 9L22 4",
  layers: "m12 2 10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5",
  bolt: "M13 2 3 14h8l-1 8L21 9h-8z",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  file: "M14 2H4v20h16V8zM14 2v6h6M8 13h8M8 17h8",
  filter: "M4 4h16M7 12h10M10 20h4M7 2v4M16 10v4M12 18v4",
  print: "M6 9V2h12v7M6 18H2V9h20v9h-4M6 14h12v8H6z",
  people:
    "M16 21v-3a5 5 0 0 0-10 0v3M15 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0M19 3a4 4 0 0 1 0 8M19 14a5 5 0 0 1 4 5v2",
  minus: "M5 12h14",
  plus: "M5 12h14M12 5v14",
  chevron: "m9 5 7 7-7 7",
};
export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 22,
  className = "",
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
