import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Sign In | Techno Architecture",
  description: "Administrative access for Techno Architecture & Design Studio.",
};

export default function LoginPage() {
  redirect("/admin");
}

