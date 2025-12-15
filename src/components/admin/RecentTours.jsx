"use client";

export const RecentTours = ({ tours, setActiveTab }) => {
  const recentTours = tours.slice(0, 3);

  return (
    <div className="bg-stone-800/50 rounded-xl border border-stone-700 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-stone-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Recent Tours</h3>
        <button
          onClick={() => setActiveTab("tours")}
          className="text-amber-400 hover:text-amber-300 text-sm font-medium"
        >
          View All
        </button>
      </div>
      <div className="divide-y divide-stone-700">
        {recentTours.map((tour) => (
          <div
            key={tour.id}
            className="p-3 md:p-4 hover:bg-stone-700/30 transition-colors grid grid-cols-5 items-center"
          >
            <div className="col-span-2">
              <h4 className="font-medium text-white text-sm md:text-base">
                {tour.basicInfo.title}
              </h4>
              <p className="text-stone-400 text-xs">{tour.basicInfo.category}</p>
            </div>
            <div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tour.basicInfo.status === "Active"
                    ? "bg-green-900/50 text-green-400"
                    : "bg-amber-900/50 text-amber-400"
                }`}
              >
                {tour.basicInfo.status}
              </span>
            </div>
            {tour.bookings ? (
              <div className="text-center">
                <p className="text-white font-medium text-sm md:text-base">{tour.bookings}</p>
                <p className="text-stone-400 text-xs">bookings</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white font-medium text-sm md:text-base">0</p>
                <p className="text-stone-400 text-xs">bookings</p>
              </div>
            )}
            <div className="text-right">
              <button
                onClick={() => setActiveTab("tours")}
                className="text-xs text-stone-400 hover:text-amber-400 cursor-pointer"
              >
                Edit Tour
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
