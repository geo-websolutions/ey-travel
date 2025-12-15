"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaCheck,
  FaCreditCard,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";

export default function ReservationPage() {
  const paymentMethods = [
    { type: "Visa", supported: true },
    { type: "Mastercard", supported: true },
    { type: "American Express", supported: true },
    { type: "Discover", supported: true },
    { type: "JCB", supported: true },
    { type: "Diners Club", supported: true },
    { type: "UnionPay", supported: true },
  ];

  const reservationSteps = [
    {
      step: 1,
      icon: FaCalendarAlt,
      title: "Choose Your Tour & Date",
      description:
        "Select your preferred EY Travel Egypt tour and choose your travel dates. For multi-day tours, select your date range.",
    },
    {
      step: 2,
      icon: FaUsers,
      title: "Select Number of Travelers",
      description:
        "Specify how many people will be joining the tour. Group discounts may apply for larger parties.",
    },
    {
      step: 3,
      icon: FaEnvelope,
      title: "Submit Reservation Request",
      description:
        "Provide your contact email and submit your reservation. We'll immediately check availability for your selected dates.",
    },
    {
      step: 4,
      icon: FaCreditCard,
      title: "Receive Payment Link",
      description:
        "Within hours, you'll receive a secure Stripe payment link with your total tour cost calculated automatically.",
    },
    {
      step: 5,
      icon: FaCheck,
      title: "Complete Payment",
      description:
        "Secure your booking by completing payment within 24 hours. Your spots are temporarily reserved during this period.",
    },
    {
      step: 6,
      icon: FaShieldAlt,
      title: "Get Confirmation",
      description:
        "Receive instant confirmation and prepare for an unforgettable EY Travel Egypt experience!",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Reserve Your <span className="text-amber-300">Egypt Adventure</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto"
          >
            Secure your spot with EY Travel Egypt - Where ancient wonders meet modern comfort
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-white text-amber-700 rounded-lg font-bold"
          >
            <FaLock className="mr-2" />
            Secure Booking Process
          </motion.div>
        </div>
      </section>

      {/* Reservation Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
              Simple 6-Step Reservation Process
            </h2>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              Booking your dream Egypt tour with EY Travel Egypt is quick, secure, and hassle-free
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reservationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-stone-800/50 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {step.step}
                  </div>
                  <step.icon className="text-amber-400 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-stone-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="py-20 bg-stone-800/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-6">
                Secure Payment Processing
              </h2>
              <p className="text-lg text-stone-300 mb-6">
                All payments are securely processed through <strong>Stripe</strong>, one of the
                world&apos;s most trusted payment platforms. Your financial information is never
                stored on our servers.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <FaLock className="text-green-400 mr-3 text-xl" />
                  <span className="text-stone-300">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-400 mr-3 text-xl" />
                  <span className="text-stone-300">PCI DSS compliant</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-amber-400 mr-3 text-xl" />
                  <span className="text-stone-300">24-hour payment window</span>
                </div>
              </div>

              <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-lg font-bold text-amber-400 mb-3">
                  Payment Security Guarantee
                </h3>
                <p className="text-stone-300 text-sm">
                  Your payment is fully protected. In the rare event that we cannot fulfill your
                  tour, you&apos;ll receive a 100% refund. All transactions are monitored for fraud
                  protection.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-stone-800/50 rounded-xl p-8 border border-stone-700"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaCreditCard className="mr-3 text-amber-400" />
                Supported Payment Methods
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-3 bg-stone-700/50 rounded-lg min-h-[60px]"
                  >
                    <div className="flex items-center space-x-2">
                      <FaCheck className="text-green-400 flex-shrink-0" size={16} />
                      <span className="text-stone-300 text-sm whitespace-nowrap">
                        {method.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-stone-400 text-sm">
                <p className="mb-2">• All major credit and debit cards accepted</p>
                <p className="mb-2">• Currency: USD, EUR, GBP, EGP</p>
                <p>• Real-time exchange rates applied</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
              Important Reservation Notes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaClock className="text-amber-400 mr-3" />
                24-Hour Payment Window
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Payment links are valid for 24 hours from sending time</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Reservations are automatically released if not paid within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Need more time? Contact us for extension requests</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaShieldAlt className="text-amber-400 mr-3" />
                Availability Check
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We verify tour availability before sending payment links</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Group size limitations may apply to certain tours</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Alternative dates offered if your first choice is unavailable</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EY Travel Egypt Guarantee */}
      <section className="py-20 bg-gradient-to-r from-amber-700 to-amber-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              The EY Travel Egypt Guarantee
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              At <strong>Elevate Your Travel Egypt</strong>, we&apos;re committed to crafting your
              perfect Egyptian adventure
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-3">Personalized Service</h3>
                <p className="text-amber-100">
                  Every tour is tailored to your preferences. We adapt itineraries to create your
                  ideal experience.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-3">Expert Local Guides</h3>
                <p className="text-amber-100">
                  Our certified Egyptologists bring ancient history to life with passion and
                  expertise.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-3">24/7 Support</h3>
                <p className="text-amber-100">
                  From booking to completion, we&apos;re here to ensure your journey is seamless and
                  memorable.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white/5 rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Begin Your Journey?</h3>
              <p className="text-amber-100 mb-6">
                Start your reservation today and let us handle the details for an unforgettable
                Egyptian adventure.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/destinations"
                  className="inline-flex items-center px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Browse Tours
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-stone-800/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "What happens if my preferred date is unavailable?",
                answer:
                  "We'll immediately contact you with alternative available dates that work with your schedule. Our team works to find the best possible solution for your travel plans.",
              },
              {
                question: "Can I modify my reservation after submitting?",
                answer:
                  "Yes, contact us directly at info@eytravelegypt.com or through WhatsApp. Changes are subject to availability and must be made before payment confirmation.",
              },
              {
                question: "What if I miss the 24-hour payment window?",
                answer:
                  "Your temporary reservation will be released. However, you can submit a new reservation request, and we'll check availability again for your preferred dates.",
              },
              {
                question: "Are there group discounts available?",
                answer:
                  "Yes! We offer special rates for groups of 6 or more. The discount will be automatically calculated and reflected in your payment link.",
              },
              {
                question: "What payment currencies do you accept?",
                answer:
                  "We accept USD, EUR, GBP, and EGP. The payment link will show your preferred currency with real-time exchange rates applied by Stripe.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-stone-800/50 rounded-xl p-6 border border-stone-700"
              >
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-stone-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-stone-800/50 rounded-xl p-8 border border-stone-700">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">
                Need Help with Your Reservation?
              </h3>
              <p className="text-stone-300 mb-6">
                Our team is here to assist you with any questions about the booking process
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:info@eytravelegypt.com"
                  className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope className="mr-2" />
                  Email Us
                </a>
                <a
                  href="https://wa.me/201278926104"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="mr-2" />
                  WhatsApp
                </a>
                <a
                  href="tel:+201080174045"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPhone className="mr-2" />
                  Call Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
