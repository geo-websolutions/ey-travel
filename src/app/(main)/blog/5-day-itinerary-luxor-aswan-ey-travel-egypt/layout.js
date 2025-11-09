export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "5-Day Luxor & Aswan Itinerary 2025 | EY Travel Egypt | Perfect Egypt Tour Plan",
  description:
    "Perfect 5-day Luxor & Aswan itinerary with EY Travel Egypt. Includes hot air balloon ride, Valley of the Kings, Nile cruise, temples, and Abu Simbel. Complete 2025 travel plan.",
  keywords: [
    "Egypt 5-day itinerary",
    "Luxor and Aswan travel plan",
    "Nile cruise Egypt",
    "Luxor hot air balloon ride",
    "EY Travel Egypt",
    "Egypt tour packages",
    "5 days Egypt itinerary",
    "Luxor Aswan tour plan",
    "Egypt short trip",
    "Nile River itinerary",
    "Egypt travel planning",
    "Luxor temples itinerary",
    "Aswan travel guide",
    "Egypt vacation package",
    "quick Egypt tour",
    "Egypt weekend itinerary",
    "Nile cruise package",
    "Egypt budget itinerary",
    "luxury Egypt short tour",
    "2025 Egypt travel plan",
  ],
  openGraph: {
    title: "5-Day Luxor & Aswan Itinerary 2025 | EY Travel Egypt Perfect Egypt Plan",
    description:
      "Complete 5-day Egypt itinerary covering Luxor hot air balloons, Valley of the Kings, Nile cruise, Aswan temples. Expertly planned by EY Travel Egypt for 2025 travelers.",
    url: "https://www.eytravelegypt.com/blog/5-day-itinerary-luxor-aswan-ey-travel-egypt",
    siteName: "EY Travel Egypt Blog",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/5-day-itinerary-og.webp",
        width: 1200,
        height: 630,
        alt: "5-day Luxor and Aswan itinerary map with EY Travel Egypt 2025 - temples, Nile cruise, and hot air balloon",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-11-09T00:00:00.000Z",
    authors: ["EY Travel Egypt Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "5-Day Luxor & Aswan Itinerary 2025 | EY Travel Egypt",
    description:
      "Perfect Egypt travel plan: 5 days covering Luxor temples, hot air balloon, Nile cruise, and Aswan highlights. Expert itinerary for 2025.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/5-day-itinerary-og.webp",
    ],
    creator: "@eytravelegypt",
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/blog/5-day-itinerary-luxor-aswan-ey-travel-egypt",
  },
  category: "travel",
  authors: [{ name: "EY Travel Egypt Team" }],
  publisher: "EY Travel Egypt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "article:published_time": "2025-11-09T00:00:00.000Z",
    "article:modified_time": "2025-11-09T00:00:00.000Z",
    "article:author": "EY Travel Egypt Team",
    "article:section": "Travel Tips",
    "article:tag": [
      "Egypt Itinerary",
      "Travel Planning",
      "Luxor",
      "Aswan",
      "Nile Cruise",
      "Short Trips",
    ],
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
