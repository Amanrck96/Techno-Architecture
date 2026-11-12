import React from "react";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-static";
export const revalidate = 60;

export const metadata = {
  title: "Gallery | Techno Architecture",
  description:
    "A visual collection of spaces, materials, details, models and work in progress from across Techno Architecture studio's projects.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
