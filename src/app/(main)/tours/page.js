import Link from 'next/link';
import Image from 'next/image';

const ToursPage = () => {
  const tourTypes = [
    {
      id: 'nile-cruise',
      title: 'Nile Cruise Tours',
      tagline: 'Luxury sailing between Luxor & Aswan',
      description: 'Experience ancient temples from the comfort of 5-star Nile cruises with private Egyptologists',
      highlights: [
        '3-7 night cruises on premium vessels',
        'Private guided tours at each stop',
        'Sunset cocktails on deck',
        'All-inclusive packages'
      ],
      icon: '𓁍' // Hieroglyph for boat
    },
    {
      id: 'day-tours',
      title: 'Day Tours',
      tagline: 'Bite-sized Egyptian adventures',
      description: 'Perfect for travelers with limited time - see the best of Egypt in 1-day itineraries',
      highlights: [
        'Private guides & drivers',
        'Skip-the-line access',
        'Flexible start times',
        'Includes lunch & entry fees'
      ],
      icon: '𓃭' // Hieroglyph for travel
    },
    {
      id: 'historical',
      title: 'Historical Tours',
      tagline: 'Deep dives into 5,000 years of civilization',
      description: 'For history buffs - exclusive access to restricted sites with archaeologists',
      highlights: [
        'After-hours temple visits',
        'Tomb of Nefertari access',
        'Academic-level guides',
        'Specialized itineraries'
      ],
      icon: '𓊹' // Hieroglyph for god/temple
    },
    {
      id: 'tour-packages',
      title: 'Complete Tour Packages',
      tagline: 'All-inclusive Egypt experiences',
      description: 'Multi-city journeys covering Cairo, Luxor, Aswan & Red Sea',
      highlights: [
        'Domestic flights included',
        '5-star accommodations',
        'Private transfers',
        '24/7 concierge'
      ],
      icon: '𓎟' // Hieroglyph for "lord"/package
    },
    {
      id: 'excursions',
      title: 'Excursions',
      tagline: 'Unique Egyptian experiences',
      description: 'From hot air balloons to Nubian village visits - unforgettable add-ons',
      highlights: [
        'Sunrise balloon rides',
        'Camel treks',
        'Traditional felucca sails',
        'Local artisan workshops'
      ],
      icon: '𓃀' // Hieroglyph for activity
    },
    {
      id: 'safari',
      title: 'Desert Safaris',
      tagline: 'Egypt beyond the monuments',
      description: 'White Desert camping, Siwa Oasis, and Western Desert adventures',
      highlights: [
        '4x4 desert expeditions',
        'Bedouin-style camps',
        'Stargazing experiences',
        'Oasis natural springs'
      ],
      icon: '𓃒' // Hieroglyph for desert
    },
    {
      id: 'diving-trips',
      title: 'Diving Trips',
      tagline: 'Red Sea underwater wonders',
      description: 'Certified diving tours to Thistlegorm wreck, Dolphin House & more',
      highlights: [
        'PADI-certified guides',
        'Private dive boats',
        'Equipment included',
        'Underwater photography'
      ],
      icon: '𓆛' // Hieroglyph for water
    }
  ];

  return (
    <section className="bg-soft-black text-stone-100 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO-Optimized Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Premium <span className="text-amber-400">Egypt Tour Experiences</span> - Curated by Local Experts
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            From luxury Nile cruises to adrenaline-packed desert safaris, our 150+ Egypt tours combine 
            authentic experiences with VIP treatment. All tours include private Egyptologists, 5-star 
            accommodations, and 24/7 support.
          </p>
        </div>

        {/* Value Propositions (Matching Homepage Style) */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          <div className="bg-stone-800 bg-opacity-50 p-8 rounded-xl">
            <div className="text-amber-400 text-4xl mb-4">𓂀</div>
            <h2 className="text-xl font-bold mb-3">Private Tour Options</h2>
            <p className="opacity-85">
              All tours available as private experiences with dedicated guides and vehicles. No large groups.
            </p>
          </div>
          <div className="bg-stone-800 bg-opacity-50 p-8 rounded-xl">
            <div className="text-amber-400 text-4xl mb-4">𓆎</div>
            <h2 className="text-xl font-bold mb-3">Seamless Logistics</h2>
            <p className="opacity-85">
              We handle all permits, tickets, and transfers. Just show up and enjoy.
            </p>
          </div>
          <div className="bg-stone-800 bg-opacity-50 p-8 rounded-xl">
            <div className="text-amber-400 text-4xl mb-4">𓃭</div>
            <h2 className="text-xl font-bold mb-3">Flexible Booking</h2>
            <p className="opacity-85">
              Change dates or cancel up to 30 days before for free. Travel with peace of mind.
            </p>
          </div>
        </div>

        {/* Tour Type Grid */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Explore <span className="text-amber-400">Our Tour Categories</span>
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Whether you&apos;re a history enthusiast, adventure seeker, or luxury traveler, 
            we have the perfect Egyptian experience for you.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourTypes.map((tour) => (
              <Link 
                href={`/tours/${tour.id}`}
                key={tour.id}
                className="bg-stone-800 bg-opacity-70 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-400 transition-all flex flex-col h-full group relative"
              >
                <div className="h-48 overflow-hidden relative">
                  {/* Replace with your actual tour images */}
                  <Image 
                    alt={`${tour.title} in Egypt`}
                    className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                    src={`/assets/images/tours/${tour.id}.jpg`}
                    fill
                  />
                </div>
                <div className="p-6 flex-grow">
                  <div className="text-amber-400 text-3xl mb-2">{tour.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-amber-300 mb-3">{tour.tagline}</p>
                  <div className="mb-4">
                    <p className="text-sm opacity-85 italic">&quot;{tour.description}&quot;</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-stone-700">
                    <p className="text-sm font-medium mb-2">Experience includes:</p>
                    <ul className="text-xs space-y-1">
                      {tour.highlights.map((item, i) => (
                        <li key={i} className="opacity-80">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button 
                  className="block w-full bg-amber-600 hover:bg-amber-500 text-center py-3 font-medium transition-colors mt-auto cursor-pointer"
                  aria-label={`Explore ${tour.title}`}
                >
                  View {tour.title}
                </button>
              </Link>
            ))}
          </div>
        </div> 

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Choosing Your Tour?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our Egypt specialists will design a personalized itinerary based on your interests, 
            timeline, and budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-black text-amber-400 rounded-lg font-bold hover:bg-stone-900 transition-colors block"
              aria-label="Contact our tour specialists"
            >
              Get Personalized Advice
            </Link>
            <Link 
              href="/tours/all" 
              className="px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-lg font-bold hover:bg-amber-400 hover:text-stone-300 hover:bg-opacity-10 transition-colors block"
              aria-label="Browse all Egypt tours"
            >
              See All Tour Options
            </Link>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            <span className="text-sm opacity-80">✓ Best Price Guarantee</span>
            <span className="text-sm opacity-80">✓ No Hidden Fees</span>
            <span className="text-sm opacity-80">✓ 24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursPage;