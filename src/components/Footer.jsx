import Link from "next/link"
import { Instagram } from 'lucide-react';
import { Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-soft-black text-stone-100 border-t border-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-amber-400">TRAVEL TO EGYPT WITH EY TRAVELS</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-amber-300 transition-colors">Home</Link></li>
              <li><Link href="/destinations" className="hover:text-amber-300 transition-colors">Destinations</Link></li>
              <li><Link href="/reservation" className="hover:text-amber-300 transition-colors">Reservation</Link></li>
              <li><Link href="/blog" className="hover:text-amber-300 transition-colors">Our Blog</Link></li>
            </ul>
          </div>
          
          {/* Help & Policies */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-amber-400">NEED HELP?</h5>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-amber-300 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-amber-300 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Social & Contact */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-amber-400">CONNECT WITH US</h5>
            <div className="flex space-x-4">
              <Link 
                href="https://instagram.com/eytravel" 
                aria-label="Follow us on Instagram"
                className="p-2 rounded-full bg-stone-700 hover:bg-amber-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </Link>
              <Link 
                href="https://facebook.com/eytravel" 
                aria-label="Follow us on Facebook"
                className="p-2 rounded-full bg-stone-700 hover:bg-amber-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>
              <Link 
                href="mailto:info@eytravel.com" 
                aria-label="Email us"
                className="p-2 rounded-full bg-stone-700 hover:bg-amber-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </Link>
            </div>
            
            <div className="pt-4">
              <h6 className="font-semibold mb-2">SUBSCRIBE TO OUR NEWSLETTER</h6>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 bg-stone-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label="Email for newsletter subscription"
                />
                <button 
                  type="submit" 
                  className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors"
                  aria-label="Subscribe"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                    <path d="m22 2-7 20-4-9-9-4Z"/>
                    <path d="M22 2 11 13"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-stone-700 mt-12 pt-8 text-center text-stone-400">
          <p>
            © {new Date().getFullYear()} <Link href="/" className="hover:text-amber-300 transition-colors">EY Travels</Link>. All rights reserved.
            <span className="mx-2">•</span>
            <Link href="/sitemap" className="hover:text-amber-300 transition-colors">Sitemap</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}