export function EquipmentVisual({ category }: { category: string }) {
  const solar = category.includes("solar");
  const battery = category.includes("batter");
  return (
    <div className="equipment-visual" aria-hidden="true">
      <svg viewBox="0 0 240 130" fill="none">
        <ellipse
          cx="120"
          cy="112"
          rx="72"
          ry="9"
          fill="#173f3b"
          opacity=".12"
        />
        {solar ? (
          <>
            <path
              d="M64 26h126l-22 76H42z"
              fill="#173f3b"
              stroke="#8fcbb9"
              strokeWidth="3"
            />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${88 + i * 25} 26l-22 76`} stroke="#a9dacf" />
            ))}
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${58 - i * 6} ${45 + i * 20}h126`}
                stroke="#a9dacf"
              />
            ))}
          </>
        ) : battery ? (
          <>
            <rect x="65" y="31" width="112" height="75" rx="9" fill="#173f3b" />
            <rect x="78" y="24" width="18" height="9" fill="#add95d" />
            <rect x="144" y="24" width="18" height="9" fill="#91b0a7" />
            <rect x="76" y="43" width="90" height="46" rx="5" fill="#e0ead9" />
            <path d="M122 48l-13 22h12l-5 15 18-24h-13z" fill="#517637" />
          </>
        ) : (
          <>
            <rect
              x="59"
              y="25"
              width="124"
              height="80"
              rx="12"
              fill="#173f3b"
            />
            <rect x="74" y="40" width="48" height="24" rx="4" fill="#add95d" />
            <circle cx="154" cy="53" r="10" stroke="#b8d7c7" strokeWidth="3" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M76 ${77 + i * 4}h78`} stroke="#79a697" />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
