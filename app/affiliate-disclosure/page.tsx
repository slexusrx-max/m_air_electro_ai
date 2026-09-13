import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('affiliate-disclosure'); }
export default function Page() { return <InformationPage slug="affiliate-disclosure"/>; }
