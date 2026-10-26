import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/lib/site";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: string;
  noindex?: boolean;
}

export default function Seo({
  title,
  description = siteConfig.description,
  keywords,
  image = `${siteConfig.url}/og-cover.jpg`,
  path = "/",
  type = "website",
  noindex = false,
}: SeoProps) {
  const pageTitle = path === "/" ? `${siteConfig.name} | Hotel in Ibadan` : title;
  const fullTitle = pageTitle.includes(siteConfig.shortName)
    ? pageTitle
    : `${pageTitle} | ${siteConfig.shortName}`;
  const location = useLocation();
  const privatePage = noindex || location.pathname.startsWith("/booking");
  const origin = `${siteConfig.url.replace(/\/$/, "")}/`;
  const url = new URL(privatePage ? location.pathname.replace(/^\//, "") : path.replace(/^\//, ""), origin).href;
  // Local preview assets include the preview basename; production uses the domain root.
  const imagePath = image.startsWith(import.meta.env.BASE_URL)
    ? image.slice(import.meta.env.BASE_URL.length)
    : image;
  const absoluteImage = new URL(imagePath, origin).href;

  return (
    <Helmet>
      <meta name="robots" content={privatePage ? "noindex, nofollow" : "index, follow"} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

    </Helmet>
  );
}
