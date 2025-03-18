import React from "react";
import { Helmet } from "react-helmet";

interface HeaderMetaProps {
  title: string;
  description: string;
  cannonical: string;
  children?: React.ReactNode;
}

const HeaderMeta: React.FC<HeaderMetaProps> = ({ title, description, cannonical, children }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={cannonical} />
      {children}
    </Helmet>
  );
};

export default HeaderMeta;