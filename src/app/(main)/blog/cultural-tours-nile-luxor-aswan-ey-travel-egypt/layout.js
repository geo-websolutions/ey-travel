export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Egypt Cultural Tours 2025 | EY Travel Egypt | Authentic Luxor & Aswan Experiences",
  description:
    "Experience authentic Egypt with EY Travel Egypt cultural tours. Nubian villages, traditional felucca sails, local cuisine, and ancient temples. Immersive 2025 cultural journeys.",
  keywords: [
    "Egypt cultural tours",
    "Luxor and Aswan culture",
    "Nile travel experiences",
    "hot air balloon Luxor",
    "EY Travel Egypt",
    "Elevate Your Travel Egypt",
    "Nubian cultural experiences",
    "authentic Egypt travel",
    "Egypt local traditions",
    "cultural immersion Egypt",
    "Nile felucca sailing",
    "Egyptian cuisine tours",
    "traditional Egypt experiences",
    "Luxor cultural guides",
    "Aswan Nubian villages",
    "Egypt heritage tours",
    "cultural photography Egypt",
    "local guides Egypt",
    "authentic Nile experiences",
    "2025 cultural travel",
  ],
  openGraph: {
    title: "Egypt Cultural Tours 2025 | EY Travel Egypt Authentic Experiences",
    description:
      "Immerse in authentic Egyptian culture with EY Travel Egypt. Nubian villages, traditional felucca sails, local cuisine, and cultural insights. Transformative 2025 journeys.",
    url: "https://www.eytravelegypt.com/blog/cultural-tours-nile-luxor-aswan-ey-travel-egypt",
    siteName: "EY Travel Egypt Blog",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/cultural-tours-og.webp",
        width: 1200,
        height: 630,
        alt: "Cultural experiences in Egypt with EY Travel Egypt 2025 - Nubian villages, felucca sailing, and local traditions",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-11-09T00:00:00.000Z",
    authors: ["EY Travel Egypt Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Cultural Tours 2025 | EY Travel Egypt",
    description:
      "Authentic cultural experiences in Luxor & Aswan. Nubian villages, traditional sailing, local cuisine, and immersive cultural journeys for 2025.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/cultural-tours-og.webp",
    ],
    creator: "@eytravelegypt",
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/blog/cultural-tours-nile-luxor-aswan-ey-travel-egypt",
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
    "article:section": "Cultural Travel",
    "article:tag": [
      "Cultural Tours",
      "Authentic Experiences",
      "Nubian Culture",
      "Local Traditions",
      "Immersive Travel",
      "Egypt Heritage",
    ],
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
