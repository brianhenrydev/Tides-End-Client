
export interface AmenityI {
  id: number;
  name: string;
}
export interface CampsiteI {
    id: number;
    site_number: string;
    description?: string;
    coordinates: string;
    price_per_night: string;
    max_occupancy: number;
    available: boolean;
    created_at?: string;
    updated_at?: string;
    amenities?: AmenityI[];
    images: ImageI[];
}

export interface ImageI {
    id: number;
    image_url: string;
    uploaded_at?: string;
    campsite?: number;
}


export interface ReservationInterface {
  id: number;
  campsite: CampsiteI;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

export interface ReviewI{
    id: number;
    username?: string;
    camper: CamperI;
    campground: CampsiteI;
    rating?: number;
    comment?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CamperI{
    id: number;
    user: {
    username: string;
    email: string;
    first_name:string;
    last_name:string;
  };
}

export interface PaymentMethodI {
  issuer: string;
  masked_card_number: string;
  cardholder_name: string;
  expiration_date: string;
  cvv: number;
  billing_address: string;
  is_default: boolean;
}
  
export interface ReservationI {
  id: number;
  campsite: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

export interface ProfileI {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  age: number;
  phone_number: string;
  payment_methods: PaymentMethodI[];
  reservation_history: ReservationI[];
  active_reservations: ReservationI[];
}

export interface ReviewI {
     id: number;
     text: string;
     rating: number;
     user: unknown;
}

