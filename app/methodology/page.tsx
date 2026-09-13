import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('methodology'); }
export default function Page() { return <InformationPage slug="methodology"/>; }
