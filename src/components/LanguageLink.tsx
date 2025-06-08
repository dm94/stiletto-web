import type React from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { useLanguagePrefix } from "@hooks/useLanguagePrefix";

/**
 * Component that extends the standard Link to maintain the language prefix in routes
 * Ensures that all navigations maintain the selected language
 */
const LanguageLink: React.FC<LinkProps> = ({ to, children, ...props }) => {
  const { getLanguagePrefixedPath } = useLanguagePrefix();

  // Create the new route with language prefix
  const newTo =
    typeof to === "string"
      ? getLanguagePrefixedPath(to)
      : {
          ...to,
          pathname: getLanguagePrefixedPath(to.pathname ?? "/"),
          search: to.search ?? "",
        };

  return (
    <Link to={newTo as any} {...props}> {/* TODO: Fix 'to' prop type */}
      {children}
    </Link>
  );
};

export default LanguageLink;
