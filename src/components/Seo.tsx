import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/lib/site";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: string;
}

export default function Seo({
  title,
  description = siteConfig.description,
  keywords,
  image = `${siteConfig.url}/og-cover.jpg`,
  path = "/",
  type = "website",
}: SeoProps) {
  const fullTitle = title.includes(siteConfig.shortName)
    ? title
    : `${title} | ${siteConfig.shortName}`;
  const url = `${siteConfig.url}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="theme-color" content="#1d241f" />
    </Helmet>
  );
}
