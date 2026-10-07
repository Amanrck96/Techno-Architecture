import { redirect } from "next/navigation";

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const target = params?.slug ? `/services#${params.slug}` : "/services";
  redirect(target);
}
