/**
 * Renders a JSON-LD graph into the document.
 *
 * This is a server component, so the script lands in the initial HTML and is
 * visible to crawlers that do not execute JavaScript.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema content is authored by us, never user input. The `</` escape
      // guards against a stray sequence terminating the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
