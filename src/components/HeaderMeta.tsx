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
}

const HeaderMeta: React.FC<HeaderMetaProps> = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  keywords,
  children,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {children}
    </Helmet>
  );
};

export default HeaderMeta;
