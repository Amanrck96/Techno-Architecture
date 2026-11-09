import { redirect } from "next/navigation";
import { initialServices } from "@/data/services";

export function generateStaticParams() {
  return initialServices.map((s) => ({ slug: s.slug }));
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const target = params?.slug ? `/services#${params.slug}` : "/services";
  redirect(target);
}
