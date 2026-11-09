import React from "react";
import BlogListingClient from "./BlogListingClient";

export const revalidate = 3600;

export default function BlogListingPage() {
  return <BlogListingClient />;
}
