import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('corrections-policy'); }
export default function Page() { return <InformationPage slug="corrections-policy"/>; }
