import LandingGallery from "@/components/home/LandingGallery";
import StudioPreloader from "@/components/home/StudioPreloader";

export const metadata = {
  title: "TECHNO ARCHITECTURE — Architecture shaped around people, place and purpose",
  description:
    "Techno Architecture creates thoughtful spaces that balance creativity, comfort, luxury and practical living. Led by architect Rajesh Shivaram, Basavanagudi, Bengaluru.",
};

export default function HomePage() {
  return (
    <>
      <StudioPreloader />
      <LandingGallery />
    </>
  );
}
