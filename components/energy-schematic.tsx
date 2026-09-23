import type { VisualFamily } from "@/lib/visual-system";

/** Original vector diagrams, not representations of a supplier's product. */
export function EnergySchematic({ family, className }: { family: VisualFamily; className?: string }) {
  const drawing = (() => {
    switch (family) {
      case "solar": return <><circle cx="178" cy="40" r="22"/><path d="M178 6v8m0 52v8m34-34h-8m-52 0h-8M60 65h116l28 91H32zM76 65l-9 91m33-91v91m26-91 8 91m18-91 16 91M52 96h134M42 126h153M96 156v20m42-20v20M76 177h81"/></>;
      case "batteries": return <><rect x="45" y="48" width="150" height="119" rx="15"/><path d="M66 48V34h26v14m57 0V34h26v14M64 74h29m-15-14v28M152 74h27M132 87l-32 43h26l-15 25 38-45h-27z"/></>;
      case "inverters": return <><rect x="40" y="32" width="160" height="144" rx="16"/><rect x="58" y="50" width="60" height="27" rx="5"/><circle cx="163" cy="63" r="12"/><path d="M62 116c20-58 37 58 57 0s38 58 59 0M61 153h118"/></>;
      case "chargers": return <><rect x="38" y="48" width="120" height="120" rx="14"/><path d="M62 73h69m-69 18h69m-69 18h69m-69 18h38M158 80h23q18 0 18 18v28m-12 0h24v20h-24zM193 146v19m12-19v19"/><circle cx="133" cy="144" r="7"/></>;
      case "backup": return <><path d="M23 94l85-66 85 66M41 80v94h133V80M84 174v-58h43v58"/><rect x="166" y="115" width="56" height="65" rx="8"/><path d="M189 106h11m-5 23-10 19h15l-10 18"/></>;
      case "generators": return <><rect x="28" y="55" width="184" height="111" rx="14"/><path d="M52 55V37h127v18M52 82h79v57H52zM153 81h37m-37 15h37m-37 15h37m-37 15h37M50 166v13m139-13v13"/><circle cx="170" cy="148" r="6"/></>;
      case "ev": return <><rect x="157" y="30" width="49" height="135" rx="8"/><path d="M169 48h25v32h-25zM206 61h13v69q0 16-14 16M23 123l16-41h74l24 41v38H23zM23 123h114M44 139h10m51 0h10"/><circle cx="46" cy="163" r="12"/><circle cx="115" cy="163" r="12"/></>;
      case "marine": return <><path d="M20 139h198l-34 34H58zM67 138V77h76l39 61M84 77V49h34v28M92 92h27v25H92zM126 95l27 25h-27M119 49V26M16 191q17-12 34 0t34 0t34 0t34 0t34 0t34 0"/></>;
      case "industrial": return <><rect x="51" y="67" width="128" height="93" rx="12"/><path d="M23 102h28m128 0h37v23h-37M77 68V43h64v25M76 83v58m25-58v58m25-58v58m25-58v58M66 160v16h96v-16"/></>;
      case "learn": return <><path d="M120 48q-41-23-91-8v129q49-17 91 9 42-26 91-9V40q-50-15-91 8v130M49 68h43m-43 21h43m-43 21h43m-43 21h26M142 75h45m-45 58h45M152 96h26v20h-26z"/></>;
      case "experts": return <><circle cx="94" cy="63" r="29"/><path d="M36 169v-23q0-39 58-39 32 0 47 13M169 96l41 18v28q0 28-41 47-41-19-41-47v-28zM149 142l14 14 27-30"/></>;
      case "business": return <><path d="M36 178V65h65v113m0-123V30h72v148M22 178h194M52 84h18m-18 22h18m-18 22h18m-18 22h18M118 51h35m-35 23h35m-35 23h35M165 126l17-30 17 30-17 31zM181 157v21"/></>;
      case "tools": return <><path d="M27 159h188M42 175V36M49 138l32-39 36 22 62-71M150 50h29v29"/><circle cx="82" cy="99" r="7"/><circle cx="117" cy="121" r="7"/><path d="M67 171v13m27-13v13m27-13v13m27-13v13m27-13v13m27-13v13"/></>;
      case "electrical": return <><path d="M24 105h31m46 0h31m48 0h36M55 89h46v32H55zM140 80v51m15-61v71m16-61v51M78 121v46h80v-26M78 89V47h80v23"/><circle cx="78" cy="47" r="5"/></>;
      default: return <><rect x="88" y="73" width="64" height="64" rx="13"/><rect x="16" y="21" width="49" height="37" rx="7"/><rect x="176" y="21" width="49" height="37" rx="7"/><rect x="16" y="159" width="49" height="37" rx="7"/><rect x="176" y="159" width="49" height="37" rx="7"/><path d="M40 58v47h48m64 0h48V58M40 159v-35h48m64 0h48v35M121 87l-13 21h18l-10 16"/></>;
    }
  })();
  return <svg className={className} viewBox="0 0 240 216" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>;
}
