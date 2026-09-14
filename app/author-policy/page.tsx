import { InformationPage, informationMetadata } from '@/components/marketplace/information-page';
export async function generateMetadata() { return informationMetadata('author-policy'); }
export default function Page() { return <InformationPage slug="author-policy"/>; }
