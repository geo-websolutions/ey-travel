export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Luxor to Aswan Nile Cruise 2025 | EY Travel Egypt | Luxury Nile River Tours",
  description:
    "Experience the ultimate Luxor to Aswan Nile cruise with EY Travel Egypt. Luxury ships, expert guides, hot air balloon rides, Edfu & Kom Ombo temples. Book your 2025 Egypt river adventure.",
  keywords: [
    "Luxor Aswan cruise",
    "Nile River cruise Egypt",
    "EY Travel Egypt",
    "Luxor hot air balloon",
    "Egypt luxury travel",
    "Nile tour packages",
    "Luxor to Aswan Nile cruise",
    "Egypt river cruise",
    "Nile luxury cruise",
    "Edfu Temple tours",
    "Kom Ombo Temple",
    "Egypt Nile vacation",
    "luxury Egypt tours",
    "Nile sailing experience",
    "Egypt cruise packages",
    "Aswan Philae Temple",
    "Nubian village tours",
    "Egypt guided cruise",
    "Nile river adventure",
    "Egypt 2025 tours",
  ],
  openGraph: {
    title: "Luxor to Aswan Nile Cruise 2025 | EY Travel Egypt Luxury Experience",
    description:
      "Sail the Nile in style with EY Travel Egypt. Luxury cruise from Luxor to Aswan featuring hot air balloons, ancient temples, and expert Egyptologist guides. 2025 bookings available.",
    url: "https://www.eytravelegypt.com/blog/luxor-aswan-nile-cruise-ey-travel-egypt",
    siteName: "EY Travel Egypt Blog",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/nile-cruise-og.webp",
        width: 1200,
        height: 630,
        alt: "Luxury Nile cruise ship sailing from Luxor to Aswan with EY Travel Egypt 2025",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-11-09T00:00:00.000Z",
    authors: ["EY Travel Egypt Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxor to Aswan Nile Cruise 2025 | EY Travel Egypt",
    description:
      "Luxury Nile cruise experience with hot air balloons, temple visits, and expert guides. Book your 2025 Egypt river adventure with local specialists.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/nile-cruise-og.webp",
    ],
    creator: "@eytravelegypt",
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/blog/luxor-aswan-nile-cruise-ey-travel-egypt",
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
    "article:section": "Nile Cruise",
    "article:tag": [
      "Nile Cruise",
      "Luxor",
      "Aswan",
      "Egypt Tours",
      "Luxury Travel",
      "River Cruise",
    ],
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
