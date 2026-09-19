export type BookingStatus = "held" | "confirmed" | "declined" | "cancelled" | "expired";

export type BookingPayload = {
	serviceType: "newSet" | "fill";
	service: string;
	nailLength: string | null;
	nailShape: string | null;
	date: string;
	time: string;
	designTier: 1 | 2 | 3 | 4 | null;
	extras: string[];
	contact: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		instagram: string;
	};
};
