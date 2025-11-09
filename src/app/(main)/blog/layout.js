export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Egypt Travel Blog | Expert Tips & Guides for Luxor, Aswan & Nile Tours",
  description:
    "Discover expert Egypt travel guides, tips, and insights from EY Travel Egypt. Explore Luxor temples, Aswan Nile cruises, hot air balloon rides, and hidden gems. Plan your perfect Egyptian adventure with our local expertise.",
  keywords: [
    "Egypt travel blog",
    "Luxor travel guide",
    "Aswan tours blog",
    "Nile cruise tips",
    "Egypt travel tips",
    "Luxor hot air balloon",
    "Aswan Nubian villages",
    "Egypt itinerary planning",
    "Nile River travel",
    "Egypt cultural tours",
    "Luxor temples guide",
    "Aswan travel experiences",
    "Egypt hidden gems",
    "Nile cruise experiences",
    "Egypt travel advice",
    "Luxor Aswan travel",
    "Egypt tour packages",
    "Nile sailing tips",
    "Egypt photography spots",
    "travel Egypt blog",
  ],
  openGraph: {
    title: "EY Travel Egypt Blog | Expert Guides for Luxor, Aswan & Nile Adventures",
    description:
      "Get insider Egypt travel tips from local experts. Discover Luxor's ancient wonders, Aswan's Nubian culture, Nile cruise secrets, and unforgettable hot air balloon experiences.",
    url: "https://www.eytravelegypt.com/blog",
    siteName: "EY Travel Egypt Blog",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/og_image.png",
        width: 1200,
        height: 630,
        alt: "EY Travel Egypt Blog featuring Luxor hot air balloons, Aswan temples, and Nile cruise adventures",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EY Travel Egypt Blog | Luxor, Aswan & Nile Travel Experts",
    description:
      "Expert Egypt travel guides, Nile cruise tips, Luxor hot air balloon experiences, and Aswan cultural insights from local travel specialists.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/og_image.png",
    ],
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/blog",
  },
  category: "travel",
  authors: [{ name: "EY Travel Egypt Team" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
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
  verification: {
    // Add your verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};
export default function RootLayout({ children }) {
  return <>{children}</>;
}
