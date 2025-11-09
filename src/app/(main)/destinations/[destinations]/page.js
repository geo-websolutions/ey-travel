"use client";

import TourHeroSection from "@/components/tours/TourHeroSection";
import TourIntroSection from "@/components/tours/TourIntroSection";
import TourWhyVisitSection from "@/components/tours/TourWhyVisitSection";
import TourCardsSection from "@/components/tours/TourCardsSection";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { orderBy, query, collection, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useDestinations } from "@/context/DestinationContext";
import { useTours } from "@/context/TourContext";

export default function DestinationsPage() {
  const { destinations } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { destinations: destinationsData } = useDestinations();
  const { tours: toursData } = useTours();

  const destinationData = destinationsData.find((destination) => destination.slug === destinations);

  const tours = toursData.filter((tour) =>
    tour.basicInfo.destinations.includes(destinationData.slug)
  );

  // useEffect(() => {
  //   let unsubscribeTours = () => {};
  //   let unsubscribeDestination = () => {};

  //   const fetchData = async () => {
  //     try {
  //       // 1. Fetch destination data first
  //       const destinationRef = collection(db, "destinations");
  //       const destinationQuery = query(destinationRef, where("slug", "==", destinations));

  //       unsubscribeDestination = onSnapshot(
  //         destinationQuery,
  //         (querySnapshot) => {
  //           if (!querySnapshot.empty) {
  //             const doc = querySnapshot.docs[0];
  //             setDestinationData({
  //               id: doc.id,
  //               ...doc.data(),
  //             });
  //           } else {
  //             setError("Destination not found");
  //           }
  //         },
  //         (error) => {
  //           console.error("Error fetching destination data:", error);
  //           setError("Failed to load destination");
  //         }
  //       );

  //       // 2. Fetch tours for this destination
  //       const toursRef = collection(db, "tours");
  //       const toursQuery = query(
  //         toursRef,
  //         where("basicInfo.destinations", "array-contains", destinations),
  //         where("basicInfo.status", "==", "active"),
  //         orderBy("basicInfo.createdAt", "desc")
  //       );

  //       unsubscribeTours = onSnapshot(
  //         toursQuery,
  //         (querySnapshot) => {
  //           const recentTours = querySnapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             ...doc.data(),
  //           }));
  //           setTours(recentTours);
  //         },
  //         (error) => {
  //           console.error("Error fetching tours:", error);
  //           setError("Failed to load tours");
  //         }
  //       );

  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Initialization error:", err);
  //       setError("Failed to initialize");
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     unsubscribeTours();
  //     unsubscribeDestination();
  //   };
  // }, [destinations]);

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
