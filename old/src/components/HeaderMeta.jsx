import React from "react";
import { Helmet } from "react-helmet";

const HeaderMeta = ({ title, description, cannonical, children }) => {
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
