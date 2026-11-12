import React from "react";
import AdminClient from "./AdminClient";

export const dynamic = "force-static";
export const revalidate = false;

export default function AdminPage() {
  return <AdminClient />;
}
