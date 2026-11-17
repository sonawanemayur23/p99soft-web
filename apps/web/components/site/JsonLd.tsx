// filepath: apps/web/components/site/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  if (data.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data.length === 1 ? data[0] : data).replace(/</g, "\\u003c") }}
    />
  );
}
