import { InformationPage } from "./information-page";
export function EditorialPage({ page }: { page: string }) {
  return <InformationPage slug={page} />;
}
