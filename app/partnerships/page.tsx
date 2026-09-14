import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('partnerships'); }
export default function Page() { return <InformationPage slug="partnerships"/>; }
