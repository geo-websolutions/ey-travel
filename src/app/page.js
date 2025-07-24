import Image from "next/image";
import HeaderBanner from "./components/HeaderBanner";
import HomeMainSection from "./components/HomeMainSection";

export default function Home() {
  return (
    <main>
      <HeaderBanner />
      <HomeMainSection />
    </main>
  );
}
