import Image from "next/image";
import HeaderBanner from "@/components/home/HeaderBanner";
import HomeMainSection from "@/components/home/HomeMainSection";

export default function Home() {
  return (
    <main className="">
      <HeaderBanner />
      <HomeMainSection />
    </main>
  );
}
