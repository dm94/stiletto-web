import type React from "react";
import Link from "next/link";
import { useLanguagePrefix } from "@hooks/useLanguagePrefix";

/**
 * Component that extends the standard Link to maintain the language prefix in routes
 * Ensures that all navigations maintain the selected language
 */
type LanguageLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "href"
> & {
  to: string;
};

const LanguageLink: React.FC<LanguageLinkProps> = ({ to, children, ...props }) => {
  const { getLanguagePrefixedPath } = useLanguagePrefix();

  const href = getLanguagePrefixedPath(to);

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default LanguageLink;
