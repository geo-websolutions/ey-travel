import { FaEnvelope, FaPhone, FaUser, FaComment, FaWhatsapp, FaMailBulk } from "react-icons/fa";

const CustomerInfoCard = ({ customer, bookingId }) => {
  return (
    <div className="bg-stone-800/40 rounded-lg p-4 border border-stone-700">
      <div className="flex items-center mb-3">
        <FaUser className="text-amber-400 mr-2" />
        <h4 className="font-bold text-white">Customer Information</h4>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <FaUser className="text-stone-400 mr-2" size={14} />
          <span className="text-stone-300">{customer.name}</span>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="text-stone-400 mr-2" size={14} />
          <a href={`mailto:${customer.email}`} className="text-amber-400 hover:text-amber-300">
            {customer.email}
          </a>
        </div>
        <div className="flex items-center">
          <FaPhone className="text-stone-400 mr-2" size={14} />
          <a href={`tel:${customer.phone}`} className="text-stone-300">
            {customer.phone}
          </a>
        </div>
        {customer.notes && (
          <div className="mt-3 pt-3 border-t border-stone-700">
            <div className="flex items-start">
              <FaComment className="text-stone-400 mr-2 mt-1" size={14} />
              <p className="text-stone-400 text-sm">{customer.notes}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <a
          href={`mailto:${customer.email}?subject=Booking ${bookingId}`}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
        >
          <FaMailBulk className="mr-2" size={14} />
          Email
        </a>
        <a
          href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
        >
          <FaWhatsapp className="mr-2" size={14} />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CustomerInfoCard;
