export type ServiceType = "newSet" | "fill";

export type ServiceName =
  | "Shellac"
  | "Overlay"
  | "Short"
  | "Medium"
  | "Long"
  | "XL"
  | "Press-ons";

export type DesignTier = 1 | 2 | 3 | 4;

export type BookingState = {
  step: 1 | 2 | 3 | 4;
  serviceType: ServiceType;
  service: ServiceName | null;
  date: string | null;
  time: string | null;
  designTier: DesignTier | null;
  extras: string[];
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    instagram: string;
  };
};
