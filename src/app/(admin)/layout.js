export default function RootLayout({ children }) {
  return (
    <html>
        <body>
            {children}
        </body>
    </html>
  )
}


// {
//   // Basic Information
//   basicInfo: {
//     title: "Luxury Nile Cruise",
//     slug: "luxury-nile-cruise", // Used for dynamic routes
//     shortDescription: "5-day luxury cruise from Luxor to Aswan",
//     fullDescription: "...",
//     duration: 5, // in days
//     durationType: "days", // or "hours" for day tours
//     type: "nile-cruises", // matches type slug
//     category: "premium", // historical | adventure | premium | cultural | economic | luxury
//     destinations: ["luxor", "aswan"], // array of destination slugs
//     startLocation: "Luxor",
//     endLocation: "Aswan",
//     status: "active", // active | inactive | archived
//     minAge: 12,
//     maxGroupSize: 20,
//     featured: true,
//     tags: ["luxury", "family-friendly", "historical"]
//   },

//   // Pricing Information
//   pricing: {
//     basePrice: 1200,
//     currency: "USD",
//     discount: {
//       amount: 200,
//       expires: "2023-12-31"
//     },
//     included: ["Accommodation", "Meals", "Guided tours"],
//     notIncluded: ["Flights", "Travel insurance"]
//   },

//   // Itinerary
//   itinerary: [
//     {
//       day: 1,
//       title: "Arrival in Luxor",
//       description: "Check-in and welcome dinner",
//       activities: [
//         "Hotel transfer",
//         "Welcome meeting",
//         "Dinner cruise"
//       ]
//     },
//     // ... more days
//   ],

//   // Media
//   media: {
//     coverImage: "image url",
//     gallery: [
//       "image url1",
//       "image url2"
//     ],
//     videoUrl: "youtube.com/embed/..."
//   },

//   // Availability
//   availability: {
//     startDates: ["2023-11-15", "2023-12-01", "2024-01-10"],
//     isAvailable: true,
//     lastUpdated: timestamp
//   },

//   // Reviews (could also be a subcollection)
//   reviews: [
//     {
//       userId: "user123",
//       userName: "John Doe",
//       rating: 5,
//       comment: "Amazing experience!",
//       date: timestamp
//     }
//   ],

//   // System
//   createdAt: timestamp,
//   updatedAt: timestamp,
//   views: 1245 // for popularity tracking
// }