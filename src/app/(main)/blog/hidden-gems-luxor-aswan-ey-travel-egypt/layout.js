export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Hidden Gems of Luxor & Aswan 2025 | EY Travel Egypt | Offbeat Egypt Tours",
  description:
    "Discover Egypt's hidden treasures with EY Travel Egypt. Explore Deir el-Medina, Tombs of the Nobles, Esna Temple, Nubian villages, and secret spots beyond tourist trails. Authentic 2025 experiences.",
  keywords: [
    "hidden gems Egypt",
    "offbeat Luxor tours",
    "Aswan local experiences",
    "Luxor hot air balloon Egypt",
    "EY Travel Egypt",
    "Nubian village tours",
    "Deir el-Medina Egypt",
    "Tombs of the Nobles",
    "Esna Temple tours",
    "off the beaten path Egypt",
    "secret Egypt spots",
    "authentic Egypt travel",
    "Luxor hidden temples",
    "Aswan cultural experiences",
    "Egypt local guides",
    "non touristy Egypt",
    "unique Egypt tours",
    "Egypt adventure travel",
    "Nile hidden treasures",
    "2025 Egypt experiences",
  ],
  openGraph: {
    title: "Hidden Gems of Luxor & Aswan 2025 | EY Travel Egypt Offbeat Adventures",
    description:
      "Go beyond the tourist trail with EY Travel Egypt. Discover secret temples, authentic Nubian villages, and hidden historical sites in Luxor and Aswan. 2025 authentic experiences.",
    url: "https://www.eytravelegypt.com/blog/hidden-gems-luxor-aswan-ey-travel-egypt",
    siteName: "EY Travel Egypt Blog",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/hidden-gems-og.png",
        width: 1200,
        height: 630,
        alt: "Hidden gems and offbeat locations in Luxor and Aswan with EY Travel Egypt 2025",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-11-09T00:00:00.000Z",
    authors: ["EY Travel Egypt Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidden Gems of Luxor & Aswan 2025 | EY Travel Egypt",
    description:
      "Discover Egypt's secret spots with local experts. Offbeat temples, authentic villages, and hidden historical sites beyond the tourist trail.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/hidden-gems-og.png",
    ],
    creator: "@eytravelegypt",
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/blog/hidden-gems-luxor-aswan-ey-travel-egypt",
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
    "article:section": "Destinations",
    "article:tag": [
      "Hidden Gems",
      "Offbeat Travel",
      "Luxor",
      "Aswan",
      "Cultural Experiences",
      "Local Guides",
    ],
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
