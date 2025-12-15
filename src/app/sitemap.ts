// app/sitemap.ts

import { MetadataRoute } from "next";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

// --- IMPORTANT: Replace with your actual Firebase/Firestore connection ---
// Adjust the import path for your specific project structure
import { db } from "../lib/firebase";

const BASE_URL = "https://www.eytravelegypt.com";

/**
 * Helper function to convert Firestore Timestamp to a Date object.
 */
function convertTimestampToDate(data: any): any {
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    } else if (typeof data[key] === "object" && data[key] !== null) {
      // Recursively handle nested objects
      convertTimestampToDate(data[key]);
    }
  }
  return data;
}

// --- Dynamic Data Fetching Functions ---

/**
 * Fetches all active tours from Firestore and generates sitemap entries.
 */
async function getTourSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const toursDataRef = query(collection(db, "tours"), where("basicInfo.status", "==", "active"));
    const toursData = await getDocs(toursDataRef);

    const tours = toursData.docs.map((doc) => {
      const tourData = convertTimestampToDate(doc.data());
      return {
        slug: tourData.basicInfo.slug,
        // Use lastModified if available, otherwise use the current date
        lastModified: tourData.basicInfo.lastModified || new Date(),
      };
    });

    return tours.map((tour) => ({
      url: `${BASE_URL}/destinations/tours/${tour.slug}`,
      lastModified: tour.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Error fetching tours for sitemap:", error);
    // Return an empty array on error to prevent the build from failing
    return [];
  }
}

/**
 * Fetches all destinations from Firestore and generates sitemap entries.
 */
async function getDestinationSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const destinationsDataRef = collection(db, "destinations");
    const destinationsData = await getDocs(destinationsDataRef);

    const destinations = destinationsData.docs.map((doc) => {
      const destinationData = convertTimestampToDate(doc.data());
      return {
        slug: destinationData.slug,
        lastModified: destinationData.lastModified || new Date(),
      };
    });

    return destinations.map((destination) => ({
      url: `${BASE_URL}/destinations/${destination.slug}`,
      lastModified: destination.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Error fetching destinations for sitemap:", error);
    return [];
  }
}

// --- Main sitemap function ---

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Blog Post Slugs (Hardcoded for stability based on your request)
  const blogSlugs = [
    "5-day-itinerary-luxor-aswan-ey-travel-egypt",
    "cultural-tours-nile-luxor-aswan-ey-travel-egypt",
    "hidden-gems-luxor-aswan-ey-travel-egypt",
    "luxor-aswan-egypt-travel-guide-ey-travel-egypt",
    "luxor-aswan-nile-cruise-ey-travel-egypt",
  ];

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(), // Use current date for simplicity
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Static Pages
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date("2025-11-09"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date("2025-11-09"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date("2025-11-09"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/reservation`,
      lastModified: new Date("2025-11-09"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: new Date("2025-11-09"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date("2025-11-09"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Fetch dynamic entries concurrently
  const [tourEntries, destinationEntries] = await Promise.all([
    getTourSitemapEntries(),
    getDestinationSitemapEntries(),
  ]);

  // Combine all entries
  return [
    ...staticEntries,
    ...blogEntries, // Add the hardcoded blog entries
    ...tourEntries,
    ...destinationEntries,
  ];
}
