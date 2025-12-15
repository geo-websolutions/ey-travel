"use client";

import TourHeroSection from "@/components/tours/TourHeroSection";
import TourIntroSection from "@/components/tours/TourIntroSection";
import TourWhyVisitSection from "@/components/tours/TourWhyVisitSection";
import TourCardsSection from "@/components/tours/TourCardsSection";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import { useDestinations } from "@/context/DestinationContext";
import { useTours } from "@/context/TourContext";

export default function DestinationsPage() {
  const { destinations } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { destinations: destinationsData } = useDestinations();
  const { tours: toursData } = useTours();

  if (
    !destinations ||
    destinationsData.find((destination) => destination.slug === destinations) === undefined
  ) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Destination Not Found</h1>
        </div>
      </div>
    );
  }

  const destinationData = destinationsData.find((destination) => destination.slug === destinations);

  const tours = toursData.filter((tour) =>
    tour.basicInfo.destinations.includes(destinationData.slug)
  );

  if (loading || !destinationData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-stone-800 rounded-lg">
          <h2 className="text-2xl font-bold text-amber-500 mb-2">Error 404</h2>
          <p className="mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {/* Hero Section */}
      <TourHeroSection destinationData={destinationData.heroSection} />

      {/* Intro Section */}
      <TourIntroSection destinationData={destinationData.introSection} />

      {/* Main Tours Section */}
      <TourCardsSection tours={tours} city={destinationData.heroSection.city} />

      {/* Why Luxor Section */}
      <TourWhyVisitSection destinationData={destinationData.whyVisitSection} />

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Need Help <span className="text-amber-400">Choosing a Tour</span>?
          </h2>
          <p className="text-lg mb-8">
            Our Tour specialists can create a custom itinerary based on your interests and schedule
          </p>
          <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
            Contact Our Experts
          </button>
        </div>
      </section>
    </div>
  );
}
