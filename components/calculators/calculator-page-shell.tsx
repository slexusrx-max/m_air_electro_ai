import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { PlatformShell } from '@/components/platform-shell';
import { getRequestLocale } from '@/lib/i18n/request';
import { CalculatorLocaleProvider } from './calculator-locale';
import { translateCalculator } from '@/lib/i18n/calculator-copy';
type Props={actions:Array<{href:string;label:string;variant?:'primary'|'secondary'}>;children:React.ReactNode;description:string;title:string};
export async function CalculatorPageShell({ title, description, actions, children }: Props) {
  const ro = await getRequestLocale() === 'ro';
  const l = (text: string) => translateCalculator(text, ro);
  const category = /battery|baterie/i.test(title) ? 'batteries' : /generator/i.test(title) ? 'generators' : /motor|transformer/i.test(title) ? 'industrial' : 'electrical-components';
  return <PlatformShell><section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8">
    <PageHero eyebrow={ro ? 'Calculator preliminar' : 'Preliminary calculator'} title={l(title)} description={l(description)} actions={actions.map(a => ({ ...a, label: l(a.label) }))} />
    <CalculatorLocaleProvider ro={ro}>{children}</CalculatorLocaleProvider>
    <aside className="content-panel"><h2>{ro ? 'Continuă cu echipamentele potrivite' : 'Continue with relevant equipment'}</h2>
      <p>{ro ? 'Folosește rezultatul ca cerință de selecție. Confirmă modelul, protecțiile și condițiile de montaj înainte de cumpărare.' : 'Use the result as a selection requirement. Confirm the model, protection and installation conditions before buying.'}</p>
      <div className="action-row"><Link href={`/marketplace/${category}`}>Marketplace →</Link><Link href={category === 'industrial' ? '/solutions/workshop' : '/marketplace/find-my-solution'}>{ro ? 'Planifică sistemul' : 'Plan the system'} →</Link><Link href={category === 'batteries' ? '/learn/how-to-size-backup-battery' : category === 'generators' ? '/learn/generator-vs-battery-backup' : category === 'industrial' ? '/learn/industrial-motor-planning' : '/learn/cable-and-protection-basics'}>{ro ? 'Ghid tehnic' : 'Technical guide'} →</Link></div>
    </aside>
  </section></PlatformShell>;
}
