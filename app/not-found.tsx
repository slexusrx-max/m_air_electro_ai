import Link from "next/link";

// Keep this boundary independent of the async page shell: Next may stream it
// alongside a pending page. A second shell would duplicate navigation IDs.
export default function NotFound() {
  return (
    <main className="mx-auto my-16 w-full max-w-3xl px-5">
      <section className="info-card p-8 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-bold">Pagina nu a fost găsită.</h1>
        <p className="mt-5 leading-8">
          Adresa poate fi incompletă sau pagina a fost mutată. Continuă de la
          pagina principală sau consultă echipamentele.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="button-primary">
            Pagina principală
          </Link>
          <Link href="/marketplace" className="button-outline">
            Echipamente
          </Link>
        </div>
      </section>
    </main>
  );
}
