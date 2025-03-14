'use client';

import type { ReactNode } from 'react';
import Head from 'next/head';

interface HeaderMetaProps {
  title: string;
  description: string;
  canonical: string;
  children?: ReactNode;
}

export default function HeaderMeta({
  title,
  description,
  canonical,
  children,
}: HeaderMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={canonical} />
      {children}
    </Head>
  );
} 