import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <Helmet>
      {payload.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
}
