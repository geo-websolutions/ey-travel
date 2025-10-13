'use client';

import Image from "next/image";
import HeaderBanner from "@/components/home/HeaderBanner";
import HomeMainSection from "@/components/home/HomeMainSection";
import { useTours } from "@/context/TourContext";

export default function Home() {
  const { tours } = useTours();
  return (
    <main className="">
      <HeaderBanner />
      <HomeMainSection tours={tours} />
    </main>
  );
}
