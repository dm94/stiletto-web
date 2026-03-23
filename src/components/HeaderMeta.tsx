import type React from "react";
import { Helmet } from "react-helmet";

interface HeaderMetaProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  keywords?: string;
  children?: React.ReactNode;
  locale?: string;
  robots?: string;
  ogType?: OpenGraphType;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export enum OpenGraphType {
  Website = "website",
  Article = "article",
}

const HeaderMeta: React.FC<HeaderMetaProps> = ({
  title,
  description,
  canonical,
  image,
  keywords,
  children,
  locale = "en_US",
  robots = "index, follow",
  ogType = OpenGraphType.Website,
  structuredData,
}) => {
  const author = "@Dm94Dani";

  const getJsonLd = () => {
    const baseStructure: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: title,
      description: description,
      url: canonical,
      inLanguage: locale,
      author: {
        "@type": "Person",
        name: author,
      },
    };

    if (image) {
      baseStructure.image = image;
    }

    return JSON.stringify(
      Array.isArray(structuredData) && structuredData.length > 0
        ? structuredData
        : baseStructure,
    );
  };

  return (
    <Helmet>
      <html lang={locale.split("_")[0]} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <meta name="author" content={author} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={locale} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {image && <meta name="twitter:image:alt" content={title} />}
      <script type="application/ld+json">{getJsonLd()}</script>

      {children}
    </Helmet>
  );
};

export default HeaderMeta;
