import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/home/Hero";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";
import { Amenities } from "@/components/home/Amenities";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";

const Index = () => (
  <PageLayout>
    <Hero />
    <FeaturedRooms />
    <Amenities />
    <Testimonials />
    <CTA />
  </PageLayout>
);

export default Index;
