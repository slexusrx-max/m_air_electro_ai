import type { ProductCategory } from "@/lib/affiliate/types";
/** Original schematic illustrations, never merchant photography. */
export function EquipmentIllustration({
  category,
}: {
  category: ProductCategory;
}) {
  const solar = category.includes("solar");
  const battery =
    category.includes("batter") ||
    category === "backup-power" ||
    category === "marine-electrical";
  return (
    <svg viewBox="0 0 320 180" className="h-40 w-full" aria-hidden="true">
      <rect x="1" y="1" width="318" height="178" rx="20" fill="#e1f3ee" />
      <circle cx="266" cy="35" r="55" fill="#c5e7dc" />
      <g
        fill="none"
        stroke="#145b54"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {solar ? (
          <>
            <path d="M90 35h140l-25 104H65z" fill="#22766d" />
            <path
              d="M83 70h139M74 105h139M135 35l-25 104M180 35l-25 104"
              stroke="#b9e4cd"
            />
            <path d="M100 139v14m82-14v14M85 154h110" />
          </>
        ) : battery ? (
          <>
            <rect x="91" y="48" width="138" height="97" rx="12" fill="#fff" />
            <path d="M109 48V34h23v14m54 0V34h23v14M111 75h20m-10-10v20m70-10h20" />
            <path d="M164 72l-22 33h20l-8 25 26-37h-22z" fill="#9ad3b0" />
          </>
        ) : (
          <>
            <rect x="85" y="37" width="150" height="114" rx="12" fill="#fff" />
            <rect x="105" y="57" width="70" height="32" rx="4" fill="#b9e4cd" />
            <circle cx="205" cy="72" r="8" />
            <path d="M105 112h110m-110 13h110m-95 26v10m80-10v10" />
            <path d="M117 73h9l5-8 8 15 7-9h15" />
          </>
        )}
      </g>
      <text x="22" y="158" fontSize="11" fill="#336b62" fontFamily="sans-serif">
        M AIR · SYSTEM NOTES
      </text>
    </svg>
  );
}
