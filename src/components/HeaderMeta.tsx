import type React from "react";
import { Helmet } from "react-helmet";

interface HeaderMetaProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: string;
  keywords?: string;
  children?: React.ReactNode;
  locale?: string;
}

const HeaderMeta: React.FC<HeaderMetaProps> = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  keywords,
  children,
  locale = "en_US",
}) => {
  const author = "@Dm94Dani";

  // Crear datos estructurados JSON-LD según el tipo de contenido
  const getJsonLd = () => {
    const baseStructure = {
      "@context": "https://schema.org",
      "@type":
        type === "website"
          ? "WebSite"
          : type === "application"
            ? "SoftwareApplication"
            : "WebPage",
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
      // @ts-expect-error - image is a string
      baseStructure.image = image;
    }

    return JSON.stringify(baseStructure);
  };

  return (
    <Helmet>
      <html lang={locale.split("_")[0]} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {image && <meta name="twitter:image:alt" content={title} />}

      {/* Datos estructurados JSON-LD */}
      <script type="application/ld+json">{getJsonLd()}</script>

      {children}
    </Helmet>
  );
};

export default HeaderMeta;
