import React from "react";

export const dynamic = "force-static";
export const revalidate = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
