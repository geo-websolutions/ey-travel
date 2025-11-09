export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Egypt Destinations & Tours | EY Travel Egypt | Luxor, Aswan, Cairo, Hurghada, Marsa Alam",
  description:
    "Explore Egypt's top destinations with EY Travel Egypt. Luxor temples, Aswan Nile cruises, Cairo pyramids, Hurghada Red Sea resorts & Marsa Alam diving. Custom tours for all budgets.",
  keywords: [
    "Egypt destinations",
    "Luxor tours",
    "Aswan Nile cruise",
    "Cairo pyramids tours",
    "Hurghada Red Sea",
    "Marsa Alam diving",
    "Egypt travel packages",
    "Luxor Valley of the Kings",
    "Aswan temples",
    "Cairo sightseeing",
    "Hurghada beach resorts",
    "Marsa Alam snorkeling",
    "Egypt luxury tours",
    "budget Egypt travel",
    "Nile River cruises",
    "Egypt historical sites",
    "Red Sea vacations",
    "Egypt adventure tours",
    "custom Egypt itineraries",
    "2025 Egypt tours",
  ],
  openGraph: {
    title: "Egypt Destinations 2025 | EY Travel Egypt - Luxor, Aswan, Cairo, Hurghada, Marsa Alam",
    description:
      "Discover Egypt's wonders: Luxor's ancient temples, Aswan's Nile beauty, Cairo's pyramids, Hurghada's resorts & Marsa Alam's marine life. Expert-guided tours for 2025.",
    url: "https://www.eytravelegypt.com/destinations",
    siteName: "EY Travel Egypt",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/destinations-og.webp",
        width: 1200,
        height: 630,
        alt: "EY Travel Egypt Destinations - Luxor temples, Aswan Nile, Cairo pyramids, Hurghada and Marsa Alam Red Sea",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Destinations 2025 | EY Travel Egypt Complete Guide",
    description:
      "Explore Luxor, Aswan, Cairo, Hurghada & Marsa Alam with local experts. Ancient wonders, Nile cruises, pyramids & Red Sea adventures.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/destinations-og.webp",
    ],
    creator: "@eytravelegypt",
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/destinations",
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
    "article:section": "Destinations",
    "article:tag": [
      "Luxor",
      "Aswan",
      "Cairo",
      "Hurghada",
      "Marsa Alam",
      "Egypt Tours",
      "Nile Cruise",
      "Red Sea",
    ],
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
