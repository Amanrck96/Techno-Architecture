"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AboutContent from "@/components/about/AboutContent";

export default function TeamPage() {
  const router = useRouter();

  useEffect(() => {
    // Seamlessly redirect to the merged Our Team section on About Us page
    router.replace("/about#team");
  }, [router]);

  return <AboutContent />;
}
