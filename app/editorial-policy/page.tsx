import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('editorial-policy'); }
export default function Page() { return <InformationPage slug="editorial-policy"/>; }
