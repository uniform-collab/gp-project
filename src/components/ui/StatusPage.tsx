import Head from "next/head";

const COPY = {
  404: { title: "Page not found", message: "The page you are looking for does not exist or has moved." },
  500: { title: "Something went wrong", message: "Please try again in a moment." },
};

/** A plain error page that needs nothing from Uniform. */
export default function StatusPage({ status }: { status: keyof typeof COPY }) {
  const { title, message } = COPY[status];

  return (
    <>
      <Head>
        <title>{`${title} | GP PRO`}</title>
      </Head>
      <main className="site-container flex min-h-dvh flex-col items-start justify-center gap-6 py-20">
        <h1 className="h-split m-0">{title}</h1>
        <p className="body-lg m-0 max-w-[70ch]">{message}</p>
        <a
          href="/"
          className="btn-label inline-flex h-12 items-center rounded-pill bg-navy px-10 text-white hover:brightness-90"
        >
          Go to the homepage
        </a>
      </main>
    </>
  );
}
