// Rendered by the root layout, so it closes every page on the site.
export default function PoweredBy() {
  return (
    <p className="bg-cocoa-deep px-4 py-4 text-center text-sm text-flour/70">
      Powered by{" "}
      <a
        href="https://lytaworks.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-flour underline decoration-flour/40 underline-offset-4 transition-colors duration-200 hover:text-butter hover:decoration-butter focus-visible:outline-butter"
      >
        Lytaworks
      </a>
    </p>
  );
}
