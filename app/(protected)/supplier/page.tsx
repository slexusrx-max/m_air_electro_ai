import { redirect } from "next/navigation";

/** Legacy URL retained only to avoid broken external links. */
export default function SupplierDashboardPage() {
  redirect("/dashboard");
}
