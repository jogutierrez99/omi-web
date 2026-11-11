import type { Metadata } from "next";
import { SITE_URL } from "./site";

export const SITE_NAME = "OMI";

const LEGAL_NAME = "Embotelladora OMI C.A.";
const logo = {
  url: new URL("/images/brand/omi-logo.png", SITE_URL).href,
  width: 1962,
  height: 802,
  alt: "Logotipo de OMI",
};

export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = new URL(path, SITE_URL).href;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_VE",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [logo],
    },
  };
}

const homeUrl = new URL("/", SITE_URL).href;
const organizationId = new URL("#organization", homeUrl).href;

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": new URL("#website", homeUrl).href,
      url: homeUrl,
      name: SITE_NAME,
      inLanguage: "es-VE",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      url: homeUrl,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      logo: logo.url,
    },
  ],
};
