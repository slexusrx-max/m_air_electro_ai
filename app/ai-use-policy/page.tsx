import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('ai-use-policy'); }
export default function Page() { return <InformationPage slug="ai-use-policy"/>; }
