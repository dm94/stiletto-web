import type { ReactNode } from "react";

export default function ItemPage({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
