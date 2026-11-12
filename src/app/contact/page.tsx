import React from "react";
import ContactClient from "./ContactClient";

export const dynamic = "force-static";
export const revalidate = 60;

export const metadata = {
  title: "Contact Us | Techno Architecture",
  description:
    "Connect with Techno Architecture studio in Basavanagudi, Bengaluru for architectural consultations, master planning, and interior design.",
};

export default function ContactPage() {
  return <ContactClient />;
}
