import Link from "@/components/localized-link";

export function SelectionHelp({ ro }: { ro: boolean }) {
  return <details className="content-panel selection-help">
    <summary>{ro ? "W, Wh, Ah, AC/DC: ce înseamnă pentru alegerea mea?" : "W, Wh, Ah, AC/DC: what do they mean for my choice?"}</summary>
    <dl>
      <dt>W</dt><dd>{ro ? "Puterea cerută în același timp. Pornirea unor aparate cere mai mult decât funcționarea normală." : "Power needed at the same time. Some devices need more power at startup than while running."}</dd>
      <dt>Wh</dt><dd>{ro ? "Energia stocată. 100 W timp de 4 ore înseamnă 400 Wh la consumator, înainte de pierderi." : "Stored energy. 100 W for 4 hours needs 400 Wh at the load, before losses."}</dd>
      <dt>Ah</dt><dd>{ro ? "Capacitate electrică; compară doar împreună cu tensiunea. Wh = V × Ah: 12,8 V × 100 Ah = 1.280 Wh nominali." : "Electrical capacity; compare together with voltage. Wh = V × Ah: 12.8 V × 100 Ah = 1,280 nominal Wh."}</dd>
      <dt>LiFePO4</dt><dd>{ro ? "O chimie a bateriei, nu o confirmare de compatibilitate. Verifică BMS, temperaturile și încărcarea." : "A battery chemistry, not confirmation of compatibility. Check the BMS, temperatures and charging requirements."}</dd>
      <dt>AC / DC</dt><dd>{ro ? "AC este curentul alternativ de la priză; DC este curentul continuu al bateriei/panoului. Pentru aparate de 230 V AC, o baterie separată necesită un invertor adecvat și protecții." : "AC is alternating current at the wall socket; DC is direct current from a battery/panel. For 230 V AC devices, a standalone battery needs a suitable inverter and protection."}</dd>
    </dl>
    <Link href="/methodology">{ro ? "Metodologia calculelor și selecției" : "Calculation and selection methodology"}</Link>
  </details>;
}
