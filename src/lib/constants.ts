/** Mirror of backend constants for frontend use */
export const ROOM_TYPES = ["Deluxe Non AC", "Deluxe AC", "Suite"] as const;

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;

export const PAYMENT_METHOD = {
  RAZORPAY: "razorpay",
  UPI: "upi",
  CASH: "cash",
  CARD: "card",
} as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No Show",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-primary-soft text-primary-deep",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-gray-100 text-gray-700",
  no_show: "bg-orange-100 text-orange-800",
};
