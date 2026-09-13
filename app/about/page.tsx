import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('about'); }
export default function Page() { return <InformationPage slug="about"/>; }
