import type React from "react";
import Head from "next/head";

interface HeaderMetaProps {
  title: string;
  description: string;
  cannonical: string;
  children?: React.ReactNode;
}

const HeaderMeta: React.FC<HeaderMetaProps> = ({
  title,
  description,
  cannonical,
  children,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={cannonical} />
      {children}
    </Head>
  );
};

export default HeaderMeta;
