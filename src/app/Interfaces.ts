export interface CampsiteInterface {
    id: number;
    site_number: string;
    description?: string;
    coordinates: string;
    price_per_night: string;
    max_occupancy: number;
    available: boolean;
    created_at?: string;
    updated_at?: string;
    amineties?: AminetyInterface[];
    images: ImageInterface[];
}
export interface AminetyInterface {
  id: number;
  name: string;
}

export interface ImageInterface {
    id: number;
    image_url: string;
    uploaded_at?: string;
    campsite?: number;
}

export interface Campground {
    campgrounds: CampsiteInterface[];
}

export interface ReservationInterface {
  id: number;
  campsite: CampsiteInterface;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

export interface ReviewInterface {
    id: number;
    username?: string;
    camper: CamperInterface;
    campground: CampsiteInterface;
    rating?: number;
    comment?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CamperInterface {
    id: number;
    user: {
    username: string;
    email: string;
    first_name:string;
    last_name:string;
  };
}
