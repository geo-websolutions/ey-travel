import { BOOKING_STATUSES } from "@/utils/bookingStatuses";

const StatusBadge = ({ status }) => {
  const statusConfig = BOOKING_STATUSES[status] || BOOKING_STATUSES.pending;
  const Icon = statusConfig.icon;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full ${statusConfig.color} bg-opacity-20`}
    >
      <Icon className={`mr-2 ${statusConfig.textColor}`} size={14} />
      <span className={`text-sm font-medium ${statusConfig.textColor}`}>{statusConfig.label}</span>
    </div>
  );
};

export default StatusBadge;
