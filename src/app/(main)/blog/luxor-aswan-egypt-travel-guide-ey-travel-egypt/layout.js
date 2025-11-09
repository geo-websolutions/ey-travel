export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Luxor & Aswan Travel Guide 2025 | EY Travel Egypt | Hot Air Balloon & Temple Tours",
  description:
    "Complete Luxor & Aswan travel guide with EY Travel Egypt. Experience sunrise hot air balloon rides, Valley of the Kings, Philae Temple, Abu Simbel, and luxury Nile cruises. Expert tips for your Egypt adventure.",
  keywords: [
    "Luxor travel guide",
    "Aswan Egypt tours",
    "Luxor hot air balloon",
    "EY Travel Egypt",
    "Nile cruise experiences",
    "Egypt travel packages",
    "Valley of the Kings tours",
    "Karnak Temple guide",
    "Philae Temple Aswan",
    "Abu Simbel tours",
    "Luxor to Aswan cruise",
    "Egypt luxury travel",
    "Nile River tours",
    "Egypt temple tours",
    "Luxor West Bank",
    "Aswan Nubian culture",
    "Egypt historical tours",
    "Luxor sunrise balloon",
    "Egypt guided tours",
    "Nile Valley travel",
  ],
  openGraph: {
    title: "Luxor & Aswan Travel Guide 2025 | EY Travel Egypt Expert Tips",
    description:
      "Discover ancient Egypt with our complete Luxor & Aswan guide. Hot air balloon rides, temple explorations, Nile cruises, and local insights from EY Travel Egypt experts.",
    url: "https://www.eytravelegypt.com/blog/luxor-aswan-egypt-travel-guide-ey-travel-egypt",
    siteName: "EY Travel Egypt Blog",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/luxor-aswan-guide-og.png",
        width: 1200,
        height: 630,
        alt: "Luxor hot air balloon over ancient temples and Nile River with EY Travel Egypt",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-11-09T00:00:00.000Z",
    authors: ["EY Travel Egypt Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxor & Aswan Travel Guide | EY Travel Egypt",
    description:
      "Expert guide to Luxor temples, Aswan Nile cruises, hot air balloon experiences, and ancient Egyptian wonders. Plan your perfect trip with local specialists.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/luxor-aswan-guide-og.png",
    ],
    creator: "@eytravelegypt",
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/blog/luxor-aswan-egypt-travel-guide-ey-travel-egypt",
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
    "article:published_time": "2024-11-09T00:00:00.000Z",
    "article:author": "EY Travel Egypt Team",
    "article:section": "Travel Guides",
    "article:tag": ["Luxor", "Aswan", "Egypt Tours", "Nile Cruise", "Hot Air Balloon"],
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
